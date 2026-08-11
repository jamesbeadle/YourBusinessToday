import type { SupabaseClient } from '@supabase/supabase-js';
import { getTask } from '$lib/server/projects/getTask';
import {
	getNextGlobalPriority,
	getNextSiblingPriority
} from '$lib/server/projects/nextTaskPriorities';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export async function reparentTask(
	supabase: SupabaseClient,
	taskId: string,
	newParentTaskId: string | null
): Promise<void> {
	const task = await getTask(supabase, taskId);
	if (task === null || task.parentTaskId === newParentTaskId) return;
	if (!(await canBecomeParentOf(supabase, task, newParentTaskId))) return;
	const priority = await getNextSiblingPriority(supabase, task.projectId, newParentTaskId);
	const globalPriority = await globalPriorityFor(supabase, task, newParentTaskId);
	const { error } = await supabase
		.from('tasks')
		.update({ parent_task_id: newParentTaskId, priority, global_priority: globalPriority })
		.eq('id', taskId);
	if (error) throw error;
}

async function globalPriorityFor(
	supabase: SupabaseClient,
	task: ProjectTask,
	newParentTaskId: string | null
): Promise<number | null> {
	if (newParentTaskId !== null) return null;
	if (task.globalPriority !== null) return task.globalPriority;
	return getNextGlobalPriority(supabase, task.projectId);
}

async function canBecomeParentOf(
	supabase: SupabaseClient,
	task: ProjectTask,
	newParentTaskId: string | null
): Promise<boolean> {
	if (newParentTaskId === null) return true;
	if (newParentTaskId === task.id) return false;
	const newParent = await getTask(supabase, newParentTaskId);
	if (newParent === null || newParent.projectId !== task.projectId) return false;
	return !(await isDescendantOf(supabase, newParent, task.id));
}

async function isDescendantOf(
	supabase: SupabaseClient,
	candidate: ProjectTask,
	ancestorTaskId: string
): Promise<boolean> {
	let currentParentId = candidate.parentTaskId;
	while (currentParentId !== null) {
		if (currentParentId === ancestorTaskId) return true;
		const parent = await getTask(supabase, currentParentId);
		if (parent === null) return false;
		currentParentId = parent.parentTaskId;
	}
	return false;
}
