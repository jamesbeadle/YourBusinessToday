import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainPage } from '$lib/data/brainTypes';

export async function getBrainPage(
	supabase: SupabaseClient,
	slug: string
): Promise<BrainPage | null> {
	const { data, error } = await supabase
		.from('brain_pages')
		.select('slug, title, summary, category, body, updated_at')
		.eq('slug', slug)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return asBrainPage(data);
}

export async function getBrainPagesBySlugs(
	supabase: SupabaseClient,
	slugs: string[]
): Promise<BrainPage[]> {
	if (slugs.length === 0) return [];
	const { data, error } = await supabase
		.from('brain_pages')
		.select('slug, title, summary, category, body, updated_at')
		.in('slug', slugs);
	if (error !== null) throw error;
	return (data ?? []).map(asBrainPage);
}

function asBrainPage(row: Record<string, string>): BrainPage {
	return {
		slug: row.slug,
		title: row.title,
		summary: row.summary,
		category: row.category,
		body: row.body,
		updatedAt: row.updated_at
	};
}
