import type { SupabaseClient } from '@supabase/supabase-js';
import { findProject, projectBoard } from '$lib/server/projects/projectBoard';
import { moveByOne } from '$lib/server/ordering/rankedScope';
import type { MoveDirection } from '$lib/server/ordering/rankedSet';

export type ProjectMoveDirection = MoveDirection;

export async function moveProject(
	supabase: SupabaseClient,
	projectId: string,
	direction: ProjectMoveDirection
): Promise<void> {
	const project = await findProject(supabase, projectId);
	if (project === null) return;
	await moveByOne(projectBoard(supabase, project.ownerId), project.id, direction);
}
