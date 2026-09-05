import { isBuildInFlight } from '$lib/data/buildStatus';
import { updateTaskBuild } from './updateTaskBuild';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type BriefRevision = 'saved' | 'empty' | 'building';

export async function reviseBuildBrief(
	supabase: SupabaseClient,
	task: ProjectTask,
	brief: string
): Promise<BriefRevision> {
	if (brief.trim() === '') return 'empty';
	if (isBuildInFlight(task.buildStatus)) return 'building';
	await updateTaskBuild(supabase, task.id, { buildBrief: brief.trim() });
	return 'saved';
}
