import type { SupabaseClient } from '@supabase/supabase-js';

export async function getTaskAndDescendantIds(
	supabase: SupabaseClient,
	taskId: string
): Promise<string[]> {
	const familyIds = [taskId];
	let parentIds = [taskId];
	while (parentIds.length > 0) {
		parentIds = await getChildTaskIds(supabase, parentIds);
		familyIds.push(...parentIds);
	}
	return familyIds;
}

async function getChildTaskIds(supabase: SupabaseClient, parentIds: string[]): Promise<string[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('id')
		.in('parent_task_id', parentIds);
	if (error) throw error;
	return data.map((row) => row.id as string);
}
