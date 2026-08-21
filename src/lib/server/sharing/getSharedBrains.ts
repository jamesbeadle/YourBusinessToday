import type { SupabaseClient } from '@supabase/supabase-js';
import type { SharedBrainSummary } from '$lib/data/sharingTypes';

export async function getSharedBrains(
	supabase: SupabaseClient,
	userId: string
): Promise<SharedBrainSummary[]> {
	const { data, error } = await supabase
		.from('domain_brains')
		.select('id, name, entity_id, owner_id, entities (name)')
		.neq('owner_id', userId)
		.is('edition_of', null)
		.order('name');
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({
		brainId: row.id,
		entityId: row.entity_id,
		brainName: row.name,
		entityName: nameFrom(row.entities)
	}));
}

function nameFrom(entity: { name: string } | { name: string }[] | null): string {
	if (entity === null) return '';
	if (Array.isArray(entity)) return entity[0]?.name ?? '';
	return entity.name;
}
