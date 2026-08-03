import type { SupabaseClient } from '@supabase/supabase-js';
import type { DomainBlockKind } from '$lib/data/brainTypes';

export type BrainPageWrite = {
	slug: string;
	title: string;
	summary: string;
	kind: DomainBlockKind;
	contextSlug: string | null;
	body: string;
};

export type AppliedPageWrite = { slug: string; wasCreated: boolean };

export async function saveBrainPageWrites(
	supabase: SupabaseClient,
	writes: BrainPageWrite[]
): Promise<AppliedPageWrite[]> {
	const applied: AppliedPageWrite[] = [];
	for (const write of writes) {
		applied.push(await savePageWrite(supabase, write));
	}
	return applied;
}

async function savePageWrite(
	supabase: SupabaseClient,
	write: BrainPageWrite
): Promise<AppliedPageWrite> {
	const row = asPageRow(write);
	const existingPage = await findPage(supabase, write.slug);
	if (existingPage === null) {
		const { error } = await supabase.from('brain_pages').insert(row);
		if (error !== null) throw error;
		return { slug: write.slug, wasCreated: true };
	}
	await snapshotRevision(supabase, existingPage);
	const { error } = await supabase
		.from('brain_pages')
		.update({ ...row, updated_at: new Date().toISOString() })
		.eq('id', existingPage.id);
	if (error !== null) throw error;
	return { slug: write.slug, wasCreated: false };
}

function asPageRow(write: BrainPageWrite) {
	return {
		slug: write.slug,
		title: write.title,
		summary: write.summary,
		kind: write.kind,
		context_slug: write.contextSlug,
		body: write.body
	};
}

async function findPage(supabase: SupabaseClient, slug: string) {
	const { data, error } = await supabase
		.from('brain_pages')
		.select('id, title, summary, kind, context_slug, body')
		.eq('slug', slug)
		.maybeSingle();
	if (error !== null) throw error;
	return data;
}

async function snapshotRevision(
	supabase: SupabaseClient,
	page: {
		id: string;
		title: string;
		summary: string;
		kind: string;
		context_slug: string | null;
		body: string;
	}
) {
	const { error } = await supabase.from('brain_page_revisions').insert({
		page_id: page.id,
		title: page.title,
		summary: page.summary,
		kind: page.kind,
		context_slug: page.context_slug,
		body: page.body
	});
	if (error !== null) throw error;
}
