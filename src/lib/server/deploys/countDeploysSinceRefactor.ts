import type { SupabaseClient } from '@supabase/supabase-js';
import type { Project } from '$lib/server/projects/projectRecord';

/** How many deploys of the project's default branch have landed since the last refactor round was raised. */
export async function countDeploysSinceRefactor(
	supabase: SupabaseClient,
	project: Project
): Promise<number> {
	let query = supabase
		.from('project_deploys')
		.select('id', { count: 'exact', head: true })
		.eq('project_id', project.id)
		.eq('branch', project.defaultBranch);
	if (project.lastRefactorRaisedAt !== null) query = query.gt('pushed_at', project.lastRefactorRaisedAt);
	const { count, error } = await query;
	if (error) throw error;
	return count ?? 0;
}
