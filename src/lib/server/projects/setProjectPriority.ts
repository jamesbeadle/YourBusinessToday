import type { SupabaseClient } from '@supabase/supabase-js';
import { findProject, projectBoard } from '$lib/server/projects/projectBoard';
import { setRank } from '$lib/server/ordering/rankedScope';

/** Put a project at a rank on its owner's board; the others shift to make room. */
export async function setProjectPriority(
	supabase: SupabaseClient,
	projectId: string,
	priority: number
): Promise<void> {
	const project = await findProject(supabase, projectId);
	if (project === null || project.priority === priority) return;
	await setRank(projectBoard(supabase, project.ownerId), project.id, priority);
}
