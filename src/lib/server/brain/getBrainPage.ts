import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainPage } from '$lib/data/brainTypes';

const pageColumns = 'slug, title, summary, kind, context_slug, body, updated_at';

export async function getBrainPage(
	supabase: SupabaseClient,
	slug: string
): Promise<BrainPage | null> {
	const { data, error } = await supabase
		.from('brain_pages')
		.select(pageColumns)
		.eq('slug', slug)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return asBrainPage(data);
}

export async function getAllBrainPages(supabase: SupabaseClient): Promise<BrainPage[]> {
	const { data, error } = await supabase
		.from('brain_pages')
		.select(pageColumns)
		.order('context_slug')
		.order('slug');
	if (error !== null) throw error;
	return (data ?? []).map(asBrainPage);
}

export async function getBrainPagesBySlugs(
	supabase: SupabaseClient,
	slugs: string[]
): Promise<BrainPage[]> {
	if (slugs.length === 0) return [];
	const { data, error } = await supabase.from('brain_pages').select(pageColumns).in('slug', slugs);
	if (error !== null) throw error;
	return (data ?? []).map(asBrainPage);
}

function asBrainPage(row: Record<string, string | null>): BrainPage {
	return {
		slug: String(row.slug),
		title: String(row.title),
		summary: String(row.summary),
		kind: row.kind as BrainPage['kind'],
		contextSlug: row.context_slug,
		body: String(row.body),
		updatedAt: String(row.updated_at)
	};
}
