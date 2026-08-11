import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';
import {
	reassignValuesInOrder,
	reorderByDrop,
	type DropPlacement
} from '$lib/server/projects/dropReorder';

export async function placeGlobalTask(
	supabase: SupabaseClient,
	movedTaskId: string,
	targetTaskId: string,
	placement: DropPlacement
): Promise<void> {
	const movedTask = await findTaskWithOwner(supabase, movedTaskId);
	if (movedTask === null || movedTask.task.globalPriority === null) return;
	const queue = await getGlobalQueue(supabase, movedTask.listOwnerId);
	const reorderedQueue = reorderByDrop(queue, movedTaskId, targetTaskId, placement);
	if (reorderedQueue === null) return;
	await applyNewOrder(supabase, reorderedQueue, movedTask.task.projectId);
}

async function applyNewOrder(
	supabase: SupabaseClient,
	queue: ProjectTask[],
	movedProjectId: string
): Promise<void> {
	const globalPriorityUpdates = reassignValuesInOrder(queue, (task) => task.globalPriority);
	const projectSiblings = queue.filter((task) => task.projectId === movedProjectId);
	const priorityUpdates = reassignValuesInOrder(projectSiblings, (task) => task.priority);
	await Promise.all([
		...globalPriorityUpdates.map((update) =>
			updateTaskColumns(supabase, update.id, { global_priority: update.value })
		),
		...priorityUpdates.map((update) =>
			updateTaskColumns(supabase, update.id, { priority: update.value })
		)
	]);
}

async function findTaskWithOwner(
	supabase: SupabaseClient,
	taskId: string
): Promise<{ task: ProjectTask; listOwnerId: string } | null> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*, projects!inner(owner_id)')
		.eq('id', taskId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	const project = data.projects as { owner_id: string };
	return { task: parseTaskRecord(data), listOwnerId: project.owner_id };
}

async function getGlobalQueue(
	supabase: SupabaseClient,
	listOwnerId: string
): Promise<ProjectTask[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*, projects!inner(owner_id)')
		.eq('projects.owner_id', listOwnerId)
		.is('parent_task_id', null)
		.not('global_priority', 'is', null)
		.order('global_priority', { ascending: true });
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
