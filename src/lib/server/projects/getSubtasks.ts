import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';

export async function getSubtasks(
	supabase: SupabaseClient,
	parentTaskId: string
): Promise<ProjectTask[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*')
		.eq('parent_task_id', parentTaskId)
		.order('priority', { ascending: true });
	if (error) throw error;
	return data.map(parseTaskRecord);
}
