import { buildBranchNameFor } from './buildBranchName';
import { buildStatusLabels } from '$lib/data/buildStatus';
import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { getTaskAcceptanceCriteria } from '$lib/server/projects/getTaskAcceptanceCriteria';
import { updateTaskBuild } from './updateTaskBuild';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { AcceptanceCriterion } from '$lib/server/projects/criterionRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type BuildPack = {
	taskId: string;
	title: string;
	brief: string;
	story: string;
	criteria: AcceptanceCriterion[];
	projectName: string;
	repositoryUrl: string;
	environmentUrl: string;
	branchName: string;
};

export type ClaimOutcome = { kind: 'claimed'; pack: BuildPack } | { kind: 'refused'; sentence: string };

export async function claimBuild(supabase: SupabaseClient, taskId: string): Promise<ClaimOutcome> {
	const task = await getTask(supabase, taskId);
	if (task === null) return { kind: 'refused', sentence: 'No task has that id.' };
	if (task.buildStatus !== 'queued') {
		const state = buildStatusLabels[task.buildStatus].toLowerCase();
		return { kind: 'refused', sentence: `That task is ${state}, not queued. Do not build it.` };
	}
	const project = await getProject(supabase, task.projectId);
	if (project === null) return { kind: 'refused', sentence: 'That task has no project.' };
	await updateTaskBuild(supabase, task.id, { buildStatus: 'building' });
	await updateTaskStatus(supabase, task.id, 'in_progress');
	return {
		kind: 'claimed',
		pack: {
			taskId: task.id,
			title: task.title,
			brief: task.buildBrief,
			story: storySentence(task.isUserStory, task.storyRole, task.storyWant, task.storyBenefit),
			criteria: await getTaskAcceptanceCriteria(supabase, task.id),
			projectName: project.name,
			repositoryUrl: project.repositoryUrl,
			environmentUrl: project.environmentUrl,
			branchName: buildBranchNameFor(task.id, task.title)
		}
	};
}

function storySentence(isUserStory: boolean, role: string, want: string, benefit: string): string {
	if (!isUserStory || role === '') return '';
	return `As ${role}, I want ${want}, so that ${benefit}.`;
}
