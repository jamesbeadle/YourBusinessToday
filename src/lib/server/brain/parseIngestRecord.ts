import { isDomainBlockKind } from '$lib/data/domainBlocks';
import type { BrainContextWrite } from './saveBrainContextWrites';
import type { BrainPageWrite } from './saveBrainPageWrites';

export type IngestRecord = {
	sourceSummary: string;
	contextWrites: BrainContextWrite[];
	pageWrites: BrainPageWrite[];
	logLine: string;
};

const maxContextWrites = 4;
const maxPageWrites = 10;

export function parseIngestRecord(candidate: unknown): IngestRecord | null {
	if (!isRecord(candidate) || !Array.isArray(candidate.pageWrites)) return null;
	const pageWrites = candidate.pageWrites.slice(0, maxPageWrites).flatMap(parsePageWrite);
	if (pageWrites.length === 0) return null;
	return {
		sourceSummary: asText(candidate.sourceSummary),
		contextWrites: parseContextWrites(candidate.contextWrites),
		pageWrites,
		logLine: asText(candidate.logLine)
	};
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

function parsePageWrite(candidate: unknown): BrainPageWrite[] {
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
