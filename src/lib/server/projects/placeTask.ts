import type { SupabaseClient } from '@supabase/supabase-js';
import { findTask, siblingsOf } from '$lib/server/projects/taskSiblings';
import { placeBeside } from '$lib/server/ordering/rankedScope';
import { reparentTask } from '$lib/server/projects/reparentTask';
import { updateTaskGoal } from '$lib/server/projects/updateTaskGoal';
import type { DropPlacement } from '$lib/server/ordering/rankedSet';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

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
	await placeBeside(siblingsOf(supabase, movedTask), movedTask.id, targetTask.id, placement);
}

/**
 * A drop beside a task in another sibling group first moves the dragged task
 * into that group. If the move is refused (a cycle, or a missing parent), the
 * returned task keeps its old group, so the reorder that follows finds no
 * shared siblings and settles as a no-op. At the top level the backlog is
 * shown grouped by goal, so a drop beside a task under another goal joins it.
 */
async function movedTaskBesideTarget(
	supabase: SupabaseClient,
	movedTaskId: string,
	targetTask: ProjectTask
): Promise<ProjectTask | null> {
	const movedTask = await findTask(supabase, movedTaskId);
	if (movedTask === null) return null;
	if (isTopLevelMoveAcrossGoals(movedTask, targetTask)) {
		await updateTaskGoal(supabase, movedTaskId, targetTask.goalId);
	}
	if (movedTask.parentTaskId === targetTask.parentTaskId) return findTask(supabase, movedTaskId);
	await reparentTask(supabase, movedTaskId, targetTask.parentTaskId);
	return findTask(supabase, movedTaskId);
}

function isTopLevelMoveAcrossGoals(movedTask: ProjectTask, targetTask: ProjectTask): boolean {
	return targetTask.parentTaskId === null && movedTask.goalId !== targetTask.goalId;
}
