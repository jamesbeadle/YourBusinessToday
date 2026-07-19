import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainEvent } from '$lib/data/brainTypes';

const recentEventCount = 30;

export async function getBrainEvents(supabase: SupabaseClient): Promise<BrainEvent[]> {
	const { data, error } = await supabase
		.from('brain_events')
		.select('id, kind, detail, page_slug, created_at')
		.order('created_at', { ascending: false })
		.limit(recentEventCount);
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		kind: row.kind,
		detail: row.detail,
		pageSlug: row.page_slug,
		createdAt: row.created_at
	}));
}
