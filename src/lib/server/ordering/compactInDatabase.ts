import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Closing the gap a deleted or departed row leaves is done by the database
 * (migration 0056's functions), because the rows that shift may sit on a board
 * or in a queue the caller cannot write to themselves.
 */

export async function compactProjectBoard(supabase: SupabaseClient, ownerId: string): Promise<void> {
	await compact(supabase, 'compact_project_board', { board_owner: ownerId });
}

export async function compactGoalRanks(supabase: SupabaseClient, projectId: string): Promise<void> {
	await compact(supabase, 'compact_goal_ranks', { goal_project: projectId });
}

export async function compactTaskSiblingRanks(
	supabase: SupabaseClient,
	projectId: string
): Promise<void> {
	await compact(supabase, 'compact_task_sibling_ranks', { sibling_project: projectId });
}

export async function compactTaskQueue(supabase: SupabaseClient, ownerId: string): Promise<void> {
	await compact(supabase, 'compact_task_queue', { queue_owner: ownerId });
}

async function compact(
	supabase: SupabaseClient,
	functionName: string,
	arguments_: Record<string, string>
): Promise<void> {
	const { error } = await supabase.rpc(functionName, arguments_);
	if (error) throw error;
}
