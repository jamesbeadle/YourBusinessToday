import type { SupabaseClient } from '@supabase/supabase-js';
import { nextRankOnBoard } from '$lib/server/projects/nextRanks';

export type NewProjectSeed = {
	name: string;
	description: string;
	ownerId: string;
	createdBy: string;
};

export async function createProject(supabase: SupabaseClient, seed: NewProjectSeed): Promise<void> {
	const { error } = await supabase.from('projects').insert({
		name: seed.name,
		description: seed.description,
		priority: await nextRankOnBoard(supabase, seed.ownerId),
		owner_id: seed.ownerId,
		created_by: seed.createdBy
	});
	if (error) throw error;
}
