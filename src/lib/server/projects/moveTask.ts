import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';

export type TaskMoveDirection = 'up' | 'down';

export async function moveTask(
	supabase: SupabaseClient,
	taskId: string,
	direction: TaskMoveDirection
): Promise<void> {
	const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).maybeSingle();
	if (error) throw error;
	if (data === null) return;
	const task = parseTaskRecord(data);
	const neighbour = await findSiblingNeighbour(supabase, task, direction);
	if (neighbour === null) return;
	await setPriority(supabase, task.id, neighbour.priority);
	await setPriority(supabase, neighbour.id, task.priority);
	await swapGlobalPriorities(supabase, task, neighbour);
}

async function swapGlobalPriorities(
	supabase: SupabaseClient,
	task: ProjectTask,
	neighbour: ProjectTask
): Promise<void> {
	if (task.globalPriority === null || neighbour.globalPriority === null) return;
	await setGlobalPriority(supabase, task.id, neighbour.globalPriority);
	await setGlobalPriority(supabase, neighbour.id, task.globalPriority);
}

async function setGlobalPriority(
	supabase: SupabaseClient,
	taskId: string,
	globalPriority: number
): Promise<void> {
	const { error } = await supabase
		.from('tasks')
		.update({ global_priority: globalPriority })
		.eq('id', taskId);
	if (error) throw error;
}

async function findSiblingNeighbour(
	supabase: SupabaseClient,
	task: ProjectTask,
	direction: TaskMoveDirection
): Promise<ProjectTask | null> {
	const isMovingUp = direction === 'up';
	const siblings = supabase.from('tasks').select('*').eq('project_id', task.projectId);
	const scopedSiblings =
		task.parentTaskId === null
			? siblings.is('parent_task_id', null)
			: siblings.eq('parent_task_id', task.parentTaskId);
	const { data, error } = await scopedSiblings
		.filter('priority', isMovingUp ? 'lt' : 'gt', task.priority)
		.order('priority', { ascending: !isMovingUp })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseTaskRecord(data);
}

async function setPriority(
	supabase: SupabaseClient,
	taskId: string,
	priority: number
): Promise<void> {
	const { error } = await supabase.from('tasks').update({ priority }).eq('id', taskId);
	if (error) throw error;
}
