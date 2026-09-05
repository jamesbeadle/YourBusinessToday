import { commentOnFeatureRequest } from '$lib/server/requests/commentOnFeatureRequest';
import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import { taskIdFromBranchName } from './buildBranchName';
import { updateTaskBuild } from './updateTaskBuild';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { SupabaseClient } from '@supabase/supabase-js';

export type LiveOutcome = 'marked' | 'not_a_build' | 'no_such_task';

export async function markBuildLive(
	supabase: SupabaseClient,
	branchName: string,
	pullRequestUrl: string
): Promise<LiveOutcome> {
	const taskId = taskIdFromBranchName(branchName);
	if (taskId === null) return 'not_a_build';
	const task = await getTask(supabase, taskId);
	if (task === null) return 'no_such_task';
	const project = await getProject(supabase, task.projectId);
	if (project === null) return 'no_such_task';
	await updateTaskBuild(supabase, task.id, { buildStatus: 'live', pullRequestUrl });
	await updateTaskStatus(supabase, task.id, 'done');
	await tellTheClient(supabase, task.id, project.ownerId, project.environmentUrl);
	if (project.clientId !== null) {
		await recordClientEvent(
			supabase,
			project.clientId,
			'build_live',
			{ taskId: task.id, title: task.title, pullRequestUrl },
			null
		);
	}
	return 'marked';
}

async function tellTheClient(
	supabase: SupabaseClient,
	taskId: string,
	ownerAccountId: string,
	environmentUrl: string
): Promise<void> {
	const { data, error } = await supabase
		.from('feature_requests')
		.select('id')
		.eq('task_id', taskId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return;
	await commentOnFeatureRequest(supabase, data.id, ownerAccountId, liveSentence(environmentUrl));
}

function liveSentence(environmentUrl: string): string {
	if (environmentUrl === '') return 'This is now live.';
	return `This is now live at ${environmentUrl}.`;
}
