import type { SupabaseClient } from '@supabase/supabase-js';
import { getSiblingTasks } from '$lib/server/projects/getSiblingTasks';
import { getSubtasks } from '$lib/server/projects/getSubtasks';
import { getTask } from '$lib/server/projects/getTask';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export type TaskFamily = {
	parentTask: ProjectTask | null;
	siblingTasks: ProjectTask[];
	subtasks: ProjectTask[];
};

export async function getTaskFamily(
	supabase: SupabaseClient,
	task: ProjectTask
): Promise<TaskFamily> {
	const [parentTask, siblingTasks, subtasks] = await Promise.all([
		task.parentTaskId === null ? null : getTask(supabase, task.parentTaskId),
		getSiblingTasks(supabase, task),
		getSubtasks(supabase, task.id)
	]);
	return { parentTask, siblingTasks, subtasks };
}
