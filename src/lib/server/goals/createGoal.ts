import type { SupabaseClient } from '@supabase/supabase-js';

export type NewGoalSeed = {
	title: string;
	measure: string;
};

export function readNewGoalSeed(formData: FormData): NewGoalSeed | null {
	const title = String(formData.get('title') ?? '').trim();
	if (title === '') return null;
	return { title, measure: String(formData.get('measure') ?? '').trim() };
}

export async function createGoal(
	supabase: SupabaseClient,
	projectId: string,
	seed: NewGoalSeed,
	createdBy: string
): Promise<string> {
	const { data, error } = await supabase
		.from('goals')
		.insert({
			project_id: projectId,
			title: seed.title,
			measure: seed.measure,
			priority: (await getHighestPriority(supabase, projectId)) + 1,
			created_by: createdBy
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

async function getHighestPriority(supabase: SupabaseClient, projectId: string): Promise<number> {
	const { data, error } = await supabase
		.from('goals')
		.select('priority')
		.eq('project_id', projectId)
		.order('priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.priority ?? 0;
}
