import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';

export async function getSiblingTasks(
	supabase: SupabaseClient,
	task: ProjectTask
): Promise<ProjectTask[]> {
	const siblings = supabase.from('tasks').select('*').eq('project_id', task.projectId);
	const scopedSiblings =
		task.parentTaskId === null
			? siblings.is('parent_task_id', null)
			: siblings.eq('parent_task_id', task.parentTaskId);
	const { data, error } = await scopedSiblings.order('priority', { ascending: true });
	if (error) throw error;
	return data.map(parseTaskRecord).filter((siblingTask) => siblingTask.id !== task.id);
}
