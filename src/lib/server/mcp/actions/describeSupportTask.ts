import { accountNameLookup } from '$lib/data/accountNames';
import { formatBritishDate } from '$lib/data/britishDate';
import { taskKindLabels, taskStatusLabelFor } from '$lib/data/taskKind';
import { threadLines } from './describeMessages';
import type { Account } from '$lib/server/accounts/accountRecord';
import type { ConversationMessage } from '$lib/server/conversations/messageRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { SupportTaskListing } from '$lib/server/support/getOpenSupportTasks';

export const noReachableTask = 'No task you can reach has that id. Call find_tasks on the project first.';

export function describeTaskConversation(
	task: ProjectTask,
	projectName: string,
	messages: ConversationMessage[],
	accounts: Account[]
): string {
	return [
		`${task.title} — ${taskKindLabels[task.kind]} task, ${taskStatusLabelFor(task.kind, task.status)} (id: ${task.id})`,
		`Project: ${projectName}. Raised by ${accountNameLookup(accounts)(task.createdBy)} on ${formatBritishDate(task.createdAt)}.`,
		storyLine(task),
		task.details === '' ? null : task.details,
		resolutionLine(task),
		'',
		...threadLines(messages, accounts)
	]
		.filter((line) => line !== null)
		.join('\n');
}

function storyLine(task: ProjectTask): string | null {
	if (!task.isUserStory) return null;
	return `As ${task.storyRole}, I want ${task.storyWant}, so that ${task.storyBenefit}.`;
}

function resolutionLine(task: ProjectTask): string | null {
	if (task.resolution === '') return null;
	return `Resolution: ${task.resolution}`;
}

export function describeOpenSupportTasks(tasks: SupportTaskListing[]): string {
	if (tasks.length === 0) return 'No support task is waiting on us.';
	return tasks.map(listingLine).join('\n');
}

function listingLine(task: SupportTaskListing): string {
	const status = taskStatusLabelFor(task.kind, task.status);
	return `${task.title} — ${task.projectName} — ${status}, raised ${formatBritishDate(task.createdAt)} (id: ${task.id})`;
}
