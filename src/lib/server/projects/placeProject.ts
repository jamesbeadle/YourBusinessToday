import type { SupabaseClient } from '@supabase/supabase-js';
import { findProject, projectBoard } from '$lib/server/projects/projectBoard';
import { placeBeside } from '$lib/server/ordering/rankedScope';
import type { DropPlacement } from '$lib/server/ordering/rankedSet';

export async function placeProject(
	supabase: SupabaseClient,
	movedProjectId: string,
	targetProjectId: string,
	placement: DropPlacement
): Promise<void> {
	if (placement === 'inside') return;
	const movedProject = await findProject(supabase, movedProjectId);
	if (movedProject === null) return;
	await placeBeside(
		projectBoard(supabase, movedProject.ownerId),
		movedProject.id,
		targetProjectId,
		placement
	);
}
