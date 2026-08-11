import type { SupabaseClient } from '@supabase/supabase-js';

export type NewProjectSeed = {
	name: string;
	description: string;
	ownerId: string;
	createdBy: string;
};

export async function createProject(supabase: SupabaseClient, seed: NewProjectSeed): Promise<void> {
	const nextPriority = (await getHighestPriority(supabase, seed.ownerId)) + 1;
	const { error } = await supabase.from('projects').insert({
		name: seed.name,
		description: seed.description,
		priority: nextPriority,
		owner_id: seed.ownerId,
		created_by: seed.createdBy
	});
	if (error) throw error;
}

async function getHighestPriority(supabase: SupabaseClient, ownerId: string): Promise<number> {
	const { data, error } = await supabase
		.from('projects')
		.select('priority')
		.eq('owner_id', ownerId)
		.order('priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.priority ?? 0;
}
