import { downloadSourceFile } from './downloadSourceFile';
import { getBrainContexts } from './getBrainContexts';
import { getBrainPageIndex } from './getBrainPageIndex';
import { ingestSource } from './ingestSource';
import { markSourceStatus } from './findBrainSource';
import { recordBrainEvent } from './recordBrainEvent';
import { saveBrainContextWrites } from './saveBrainContextWrites';
import { saveBrainPageWrites } from './saveBrainPageWrites';
import { sourceContentBlock } from './sourceContentBlock';
import type { StoredBrainSource } from './findBrainSource';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function runSourceIngest(
	supabase: SupabaseClient,
	source: StoredBrainSource
): Promise<void> {
	const fileBytes = await downloadSourceFile(supabase, source.storagePath);
	const contentBlock = await sourceContentBlock(fileBytes, source.mimeType);
	const contexts = await getBrainContexts(supabase);
	const index = await getBrainPageIndex(supabase);
	const record = await ingestSource(contentBlock, source.filename, contexts, index);
	const appliedContextWrites = await saveBrainContextWrites(supabase, record.contextWrites);
	const appliedPageWrites = await saveBrainPageWrites(supabase, record.pageWrites);
	await recordContextEvents(supabase, source.id, appliedContextWrites);
	await recordPageEvents(supabase, source.id, appliedPageWrites);
	await recordBrainEvent(supabase, {
		kind: 'source_ingested',
		detail: { filename: source.filename, logLine: record.logLine },
		sourceId: source.id
	});
	await markSourceStatus(supabase, source.id, 'ingested', record.sourceSummary);
}

async function recordContextEvents(
	supabase: SupabaseClient,
	sourceId: string,
	appliedWrites: { slug: string; wasCreated: boolean }[]
): Promise<void> {
	for (const write of appliedWrites) {
		await recordBrainEvent(supabase, {
			kind: write.wasCreated ? 'context_created' : 'context_updated',
			detail: { contextSlug: write.slug },
			sourceId
		});
	}
}

async function recordPageEvents(
	supabase: SupabaseClient,
	sourceId: string,
	appliedWrites: { slug: string; wasCreated: boolean }[]
): Promise<void> {
	for (const write of appliedWrites) {
		await recordBrainEvent(supabase, {
			kind: write.wasCreated ? 'page_created' : 'page_updated',
			detail: {},
			sourceId,
			pageSlug: write.slug
		});
	}
}
