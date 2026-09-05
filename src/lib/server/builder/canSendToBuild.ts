import type { Project } from '$lib/server/projects/projectRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export type SendRefusal =
	| 'no_repository'
	| 'no_brief'
	| 'already_building'
	| 'already_live'
	| 'awaiting_merge';

export function canSendToBuild(task: ProjectTask, project: Project): SendRefusal | null {
	if (project.repositoryUrl === '') return 'no_repository';
	if (task.buildBrief.trim() === '') return 'no_brief';
	if (task.buildStatus === 'queued' || task.buildStatus === 'building') return 'already_building';
	if (task.buildStatus === 'live') return 'already_live';
	if (task.buildStatus === 'in_review' && task.pullRequestUrl !== '') return 'awaiting_merge';
	return null;
}

export const sendRefusalSentences: Record<SendRefusal, string> = {
	no_repository: 'This project has no repository recorded, so there is nothing to build against.',
	no_brief: 'Write the brief first. The Builder works from your words, not the client’s.',
	already_building: 'A build is already running for this task.',
	already_live: 'This task is live. Raise a new task for further work.',
	awaiting_merge: 'The pull request is open. Merge or close it before building again.'
};
