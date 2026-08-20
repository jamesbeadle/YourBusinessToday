import type { SupabaseClient } from '@supabase/supabase-js';

export type DomainBrain = {
	id: string;
	entityId: string;
	name: string;
};

export async function getDomainBrain(
	supabase: SupabaseClient,
	brainId: string
): Promise<DomainBrain | null> {
	const { data, error } = await supabase
		.from('domain_brains')
		.select('id, entity_id, name')
		.eq('id', brainId)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return { id: data.id, entityId: data.entity_id, name: data.name };
}

export async function getLatestDomainBrain(
	supabase: SupabaseClient
): Promise<DomainBrain | null> {
	const { data, error } = await supabase
		.from('domain_brains')
		.select('id, entity_id, name')
		.order('created_at', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return { id: data.id, entityId: data.entity_id, name: data.name };
}
