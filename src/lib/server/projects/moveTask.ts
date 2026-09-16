import type { SupabaseClient } from '@supabase/supabase-js';
import { findTask, siblingsOf } from '$lib/server/projects/taskSiblings';
import { moveByOne } from '$lib/server/ordering/rankedScope';
import type { MoveDirection } from '$lib/server/ordering/rankedSet';

export type TaskMoveDirection = MoveDirection;

export async function moveTask(
	supabase: SupabaseClient,
	taskId: string,
	direction: TaskMoveDirection
): Promise<void> {
	const task = await findTask(supabase, taskId);
	if (task === null) return;
	await moveByOne(siblingsOf(supabase, task), task.id, direction);
}
