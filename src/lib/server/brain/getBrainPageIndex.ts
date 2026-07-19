import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainPageSummary } from '$lib/data/brainTypes';

export async function getBrainPageIndex(supabase: SupabaseClient): Promise<BrainPageSummary[]> {
	const { data, error } = await supabase
		.from('brain_pages')
		.select('slug, title, summary, category')
		.order('category')
		.order('title');
	if (error !== null) throw error;
	return data ?? [];
}

export function renderBrainPageIndex(index: BrainPageSummary[]): string {
	if (index.length === 0) return 'The wiki is empty — no pages exist yet.';
	const categories = [...new Set(index.map((page) => page.category))];
	return categories.map((category) => renderCategory(category, index)).join('\n\n');
}

function renderCategory(category: string, index: BrainPageSummary[]): string {
	const lines = index
		.filter((page) => page.category === category)
		.map((page) => `- ${page.slug} — ${page.title}: ${page.summary}`);
	return [`### ${category}`, ...lines].join('\n');
}
