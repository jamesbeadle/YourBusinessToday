import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';
import { reparentTask } from '$lib/server/projects/reparentTask';
import {
	reassignValuesInOrder,
	reorderByDrop,
	type DropPlacement
} from '$lib/server/projects/dropReorder';

export async function placeTask(
	supabase: SupabaseClient,
	movedTaskId: string,
	targetTaskId: string,
	placement: DropPlacement
): Promise<void> {
	if (placement === 'inside') return reparentTask(supabase, movedTaskId, targetTaskId);
	const targetTask = await findTask(supabase, targetTaskId);
	if (targetTask === null) return;
	const movedTask = await movedTaskBesideTarget(supabase, movedTaskId, targetTask);
	if (movedTask === null) return;
	const siblings = await getSiblingsByPriority(supabase, movedTask);
	const reorderedSiblings = reorderByDrop(siblings, movedTaskId, targetTaskId, placement);
	if (reorderedSiblings === null) return;
	await applyNewOrder(supabase, reorderedSiblings);
}

/**
 * A drop beside a task in another sibling group first moves the dragged task
 * into that group. If the move is refused (a cycle, or a missing parent), the
 * returned task keeps its old group, so the reorder that follows finds no
 * shared siblings and settles as a no-op.
 */
async function movedTaskBesideTarget(
	supabase: SupabaseClient,
	movedTaskId: string,
	targetTask: ProjectTask
): Promise<ProjectTask | null> {
	const movedTask = await findTask(supabase, movedTaskId);
	if (movedTask === null || movedTask.parentTaskId === targetTask.parentTaskId) return movedTask;
	await reparentTask(supabase, movedTaskId, targetTask.parentTaskId);
	return findTask(supabase, movedTaskId);
}

async function applyNewOrder(supabase: SupabaseClient, siblings: ProjectTask[]): Promise<void> {
	const priorityUpdates = reassignValuesInOrder(siblings, (task) => task.priority);
	const globalPriorityUpdates = reassignValuesInOrder(siblings, (task) => task.globalPriority);
	await Promise.all([
		...priorityUpdates.map((update) =>
			updateTaskColumns(supabase, update.id, { priority: update.value })
		),
		...globalPriorityUpdates.map((update) =>
			updateTaskColumns(supabase, update.id, { global_priority: update.value })
		)
	]);
}

async function findTask(supabase: SupabaseClient, taskId: string): Promise<ProjectTask | null> {
	const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseTaskRecord(data);
}

async function getSiblingsByPriority(
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
	return data.map(parseTaskRecord);
}

async function updateTaskColumns(
	supabase: SupabaseClient,
	taskId: string,
	columns: Record<string, number>
): Promise<void> {
	const { error } = await supabase.from('tasks').update(columns).eq('id', taskId);
	if (error) throw error;
}
