import type { SupabaseClient } from '@supabase/supabase-js';

export type BrainPageWrite = {
	slug: string;
	title: string;
	summary: string;
	category: string;
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
	const existingPage = await findPage(supabase, write.slug);
	if (existingPage === null) {
		const { error } = await supabase.from('brain_pages').insert(write);
		if (error !== null) throw error;
		return { slug: write.slug, wasCreated: true };
	}
	await snapshotRevision(supabase, existingPage);
	const { error } = await supabase
		.from('brain_pages')
		.update({ ...write, updated_at: new Date().toISOString() })
		.eq('id', existingPage.id);
	if (error !== null) throw error;
	return { slug: write.slug, wasCreated: false };
}

async function findPage(supabase: SupabaseClient, slug: string) {
	const { data, error } = await supabase
		.from('brain_pages')
		.select('id, title, summary, category, body')
		.eq('slug', slug)
		.maybeSingle();
	if (error !== null) throw error;
	return data;
}

async function snapshotRevision(
	supabase: SupabaseClient,
	page: { id: string; title: string; summary: string; category: string; body: string }
) {
	const { error } = await supabase.from('brain_page_revisions').insert({
		page_id: page.id,
		title: page.title,
		summary: page.summary,
		category: page.category,
		body: page.body
	});
	if (error !== null) throw error;
}
