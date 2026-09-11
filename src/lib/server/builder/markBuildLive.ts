import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { postMessage } from '$lib/server/conversations/postMessage';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import { taskIdFromBranchName } from './buildBranchName';
import { updateTaskBuild } from './updateTaskBuild';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
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
	await tellTheRaiser(supabase, task, project.ownerId, project.environmentUrl);
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

async function tellTheRaiser(
	supabase: SupabaseClient,
	task: ProjectTask,
	ownerAccountId: string,
	environmentUrl: string
): Promise<void> {
	const sentence = liveSentence(environmentUrl);
	if (task.kind === 'support') await recordResolution(supabase, task.id, sentence);
	await postMessage(supabase, { taskId: task.id }, ownerAccountId, sentence, false);
}

async function recordResolution(
	supabase: SupabaseClient,
	taskId: string,
	resolution: string
): Promise<void> {
	const { error } = await supabase
		.from('tasks')
		.update({ resolution, resolved_at: new Date().toISOString() })
		.eq('id', taskId);
	if (error) throw error;
}

function liveSentence(environmentUrl: string): string {
	if (environmentUrl === '') return 'This is now live.';
	return `This is now live at ${environmentUrl}.`;
}
