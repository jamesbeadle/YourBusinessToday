import type { SupabaseClient } from '@supabase/supabase-js';

export type UnfiledDomainBrain = {
	id: string;
	name: string;
	entityId: string;
	entityName: string;
};

export async function getUnfiledDomainBrains(
	supabase: SupabaseClient,
	ownerId: string
): Promise<UnfiledDomainBrain[]> {
	const [ownedBrains, filedBrainIds] = await Promise.all([
		ownedDomainBrains(supabase, ownerId),
		filedDomainBrainIds(supabase)
	]);
	return ownedBrains.filter((brain) => !filedBrainIds.has(brain.id));
}

async function ownedDomainBrains(
	supabase: SupabaseClient,
	ownerId: string
): Promise<UnfiledDomainBrain[]> {
	const { data, error } = await supabase
		.from('domain_brains')
		.select('id, name, entity_id, entities(name)')
		.eq('owner_id', ownerId)
		.is('edition_of', null)
		.order('created_at');
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		entityId: row.entity_id,
		entityName: entityNameFrom(row.entities)
	}));
}

function entityNameFrom(entities: { name: string } | { name: string }[] | null): string {
	if (entities === null) return '';
	return Array.isArray(entities) ? (entities[0]?.name ?? '') : entities.name;
}

async function filedDomainBrainIds(supabase: SupabaseClient): Promise<Set<string>> {
	const { data, error } = await supabase
		.from('kb_brains')
		.select('domain_brain_id')
		.not('domain_brain_id', 'is', null);
	if (error !== null) throw error;
	return new Set((data ?? []).map((row) => row.domain_brain_id as string));
}
