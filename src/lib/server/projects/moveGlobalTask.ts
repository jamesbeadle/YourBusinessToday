import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';
import type { TaskMoveDirection } from '$lib/server/projects/moveTask';

export async function moveGlobalTask(
	supabase: SupabaseClient,
	taskId: string,
	direction: TaskMoveDirection,
	shouldIncludeDone: boolean
): Promise<void> {
	const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).maybeSingle();
	if (error) throw error;
	if (data === null) return;
	const task = parseTaskRecord(data);
	if (task.globalPriority === null) return;
	const neighbour = await findGlobalNeighbour(supabase, task, direction, shouldIncludeDone);
	if (neighbour === null || neighbour.globalPriority === null) return;
	await updateTask(supabase, task.id, { global_priority: neighbour.globalPriority });
	await updateTask(supabase, neighbour.id, { global_priority: task.globalPriority });
	if (task.projectId !== neighbour.projectId) return;
	await updateTask(supabase, task.id, { priority: neighbour.priority });
	await updateTask(supabase, neighbour.id, { priority: task.priority });
}

async function findGlobalNeighbour(
	supabase: SupabaseClient,
	task: ProjectTask,
	direction: TaskMoveDirection,
	shouldIncludeDone: boolean
): Promise<ProjectTask | null> {
	const isMovingUp = direction === 'up';
	const topLevelTasks = supabase.from('tasks').select('*').is('parent_task_id', null);
	const scopedTasks = shouldIncludeDone ? topLevelTasks : topLevelTasks.neq('status', 'done');
	const { data, error } = await scopedTasks
		.not('global_priority', 'is', null)
		.filter('global_priority', isMovingUp ? 'lt' : 'gt', task.globalPriority)
		.order('global_priority', { ascending: !isMovingUp })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseTaskRecord(data);
}

async function updateTask(
	supabase: SupabaseClient,
	taskId: string,
	update: Record<string, number>
): Promise<void> {
	const { error } = await supabase.from('tasks').update(update).eq('id', taskId);
	if (error) throw error;
}
