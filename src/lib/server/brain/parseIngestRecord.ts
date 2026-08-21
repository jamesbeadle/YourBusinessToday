import { isDomainBlockKind } from '$lib/data/domainBlocks';
import type { BrainContextWrite } from './saveBrainContextWrites';
import type { BrainPageWrite } from './saveBrainPageWrites';

export type IngestRecord = {
	sourceSummary: string;
	contextWrites: BrainContextWrite[];
	pageWrites: BrainPageWrite[];
	pageRetires: string[];
	logLine: string;
};

const maxContextWrites = 4;
const maxPageWrites = 10;
const maxPageRetires = 10;

export function parseIngestRecord(candidate: unknown): IngestRecord | null {
	if (!isRecord(candidate) || !Array.isArray(candidate.pageWrites)) return null;
	const pageWrites = candidate.pageWrites.slice(0, maxPageWrites).flatMap(parsePageWrite);
	const record = {
		sourceSummary: asText(candidate.sourceSummary),
		contextWrites: parseContextWrites(candidate.contextWrites),
		pageWrites,
		pageRetires: parsePageRetires(candidate.pageRetires, pageWrites),
		logLine: asText(candidate.logLine)
	};
	if (isEmptyHanded(record)) return null;
	return record;
}

function isEmptyHanded(record: IngestRecord): boolean {
	if (record.pageWrites.length > 0 || record.contextWrites.length > 0) return false;
	if (record.pageRetires.length > 0) return false;
	return record.sourceSummary === '' && record.logLine === '';
}

function parsePageRetires(candidate: unknown, pageWrites: BrainPageWrite[]): string[] {
	if (!Array.isArray(candidate)) return [];
	const writtenSlugs = pageWrites.map((write) => write.slug);
	const slugs = candidate
		.slice(0, maxPageRetires)
		.map((entry) => slugify(asText(entry)))
		.filter((slug) => slug !== '' && !writtenSlugs.includes(slug));
	return [...new Set(slugs)];
}

function parseContextWrites(candidate: unknown): BrainContextWrite[] {
	if (!Array.isArray(candidate)) return [];
	return candidate.slice(0, maxContextWrites).flatMap(parseContextWrite);
}

function parseContextWrite(candidate: unknown): BrainContextWrite[] {
	if (!isRecord(candidate)) return [];
	const slug = slugify(asText(candidate.slug));
	const name = asText(candidate.name);
	if (slug === '' || name === '') return [];
	return [
		{
			slug,
			name,
			summary: asText(candidate.summary),
			isCoreDomain: candidate.isCoreDomain === true
		}
	];
}

export function parsePageWrite(candidate: unknown): BrainPageWrite[] {
	if (!isRecord(candidate)) return [];
	const slug = slugify(asText(candidate.slug));
	const title = asText(candidate.title);
	const body = typeof candidate.body === 'string' ? candidate.body : '';
	if (slug === '' || title === '' || body === '') return [];
	const kind = asBlockKind(asText(candidate.kind));
	const contextSlug = slugify(asText(candidate.contextSlug));
	return [
		{
			slug,
			title,
			summary: asText(candidate.summary),
			kind,
			contextSlug: contextSlug === '' ? null : contextSlug,
			body
		}
	];
}

function asBlockKind(candidate: string): BrainPageWrite['kind'] {
	if (isDomainBlockKind(candidate)) return candidate;
	return 'entity';
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function asText(candidate: unknown): string {
	if (typeof candidate !== 'string') return '';
	return candidate.trim();
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
	return typeof candidate === 'object' && candidate !== null;
}
