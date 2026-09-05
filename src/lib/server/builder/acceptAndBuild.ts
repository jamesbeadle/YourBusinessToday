import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { promoteFeatureRequestToTask } from '$lib/server/requests/promoteFeatureRequestToTask';
import { sendTaskToBuild, type SendOutcome } from './sendTaskToBuild';
import type { RequestDetail } from '$lib/server/requests/getFeatureRequest';
import type { SupabaseClient } from '@supabase/supabase-js';

export type BuildSeed = { brief: string; storyPoints: number };

export type AcceptAndBuildOutcome = { taskId: string; send: SendOutcome };

export async function acceptAndBuild(
	supabase: SupabaseClient,
	request: RequestDetail,
	contactRole: string,
	seed: BuildSeed,
	actorAccountId: string
): Promise<AcceptAndBuildOutcome> {
	const taskId = await promoteFeatureRequestToTask(supabase, request, contactRole, actorAccountId);
	await seedTaskForBuild(supabase, taskId, seed);
	return { taskId, send: await sendFreshTask(supabase, taskId, actorAccountId) };
}

async function seedTaskForBuild(
	supabase: SupabaseClient,
	taskId: string,
	seed: BuildSeed
): Promise<void> {
	const { error } = await supabase
		.from('tasks')
		.update({ build_brief: seed.brief.trim(), story_points: seed.storyPoints })
		.eq('id', taskId);
	if (error) throw error;
}

async function sendFreshTask(
	supabase: SupabaseClient,
	taskId: string,
	actorAccountId: string
): Promise<SendOutcome> {
	const task = await getTask(supabase, taskId);
	if (task === null) return { kind: 'refused', sentence: 'The task vanished before sending.' };
	const project = await getProject(supabase, task.projectId);
	if (project === null) return { kind: 'refused', sentence: 'The project vanished before sending.' };
	return sendTaskToBuild(supabase, task, project, actorAccountId);
}
