import type { SupabaseClient } from '@supabase/supabase-js';

export async function createTask(
	supabase: SupabaseClient,
	projectId: string,
	title: string,
	createdBy: string
): Promise<void> {
	const nextPriority = (await getHighestPriority(supabase, projectId)) + 1;
	const { error } = await supabase.from('tasks').insert({
		project_id: projectId,
		title,
		priority: nextPriority,
		created_by: createdBy
	});
	if (error) throw error;
}

async function getHighestPriority(supabase: SupabaseClient, projectId: string): Promise<number> {
	const { data, error } = await supabase
		.from('tasks')
		.select('priority')
		.eq('project_id', projectId)
		.order('priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.priority ?? 0;
}
