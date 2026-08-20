import type { SupabaseClient } from '@supabase/supabase-js';

export type EntitySummary = {
	id: string;
	name: string;
	domainBrainCount: number;
	workflowCount: number;
	createdAt: string;
};

export async function getEntityList(
	supabase: SupabaseClient,
	ownerId: string
): Promise<EntitySummary[]> {
	const { data, error } = await supabase
		.from('entities')
		.select('id, name, created_at, domain_brains(count), workflows(count)')
		.eq('owner_id', ownerId)
		.order('created_at');
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		domainBrainCount: countFrom(row.domain_brains),
		workflowCount: countFrom(row.workflows),
		createdAt: row.created_at
	}));
}

function countFrom(countRows: { count: number }[] | null): number {
	return countRows?.[0]?.count ?? 0;
}
