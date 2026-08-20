import type { SupabaseClient } from '@supabase/supabase-js';

export type DomainBrainSummary = {
	id: string;
	name: string;
	createdAt: string;
};

export async function getDomainBrains(
	supabase: SupabaseClient,
	entityId: string
): Promise<DomainBrainSummary[]> {
	const { data, error } = await supabase
		.from('domain_brains')
		.select('id, name, created_at')
		.eq('entity_id', entityId)
		.order('created_at');
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({ id: row.id, name: row.name, createdAt: row.created_at }));
}
