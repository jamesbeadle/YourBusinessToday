import type { BrainPageWrite } from './saveBrainPageWrites';

export type IngestRecord = {
	sourceSummary: string;
	pageWrites: BrainPageWrite[];
	logLine: string;
};

const maxPageWrites = 8;

export function parseIngestRecord(candidate: unknown): IngestRecord | null {
	if (!isRecord(candidate) || !Array.isArray(candidate.pageWrites)) return null;
	const pageWrites = candidate.pageWrites.slice(0, maxPageWrites).flatMap(parsePageWrite);
	if (pageWrites.length === 0) return null;
	return {
		sourceSummary: asText(candidate.sourceSummary),
		pageWrites,
		logLine: asText(candidate.logLine)
	};
}

function parsePageWrite(candidate: unknown): BrainPageWrite[] {
	if (!isRecord(candidate)) return [];
	const slug = slugify(asText(candidate.slug));
	const title = asText(candidate.title);
	const body = typeof candidate.body === 'string' ? candidate.body : '';
	if (slug === '' || title === '' || body === '') return [];
	return [
		{
			slug,
			title,
			summary: asText(candidate.summary),
			category: asText(candidate.category) || 'reference',
			body
		}
	];
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
