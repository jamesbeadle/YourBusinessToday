import type { SupabaseClient } from '@supabase/supabase-js';

export async function createProject(
	supabase: SupabaseClient,
	name: string,
	description: string,
	createdBy: string
): Promise<void> {
	const nextPriority = (await getHighestPriority(supabase)) + 1;
	const { error } = await supabase
		.from('projects')
		.insert({ name, description, priority: nextPriority, created_by: createdBy });
	if (error) throw error;
}

async function getHighestPriority(supabase: SupabaseClient): Promise<number> {
	const { data, error } = await supabase
		.from('projects')
		.select('priority')
		.order('priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.priority ?? 0;
}
