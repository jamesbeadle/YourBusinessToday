import { goalStatusLabels } from '$lib/data/goalStatus';
import { taskKindLabels, taskStatusLabelFor } from '$lib/data/taskKind';
import { threadLines } from './describeMessages';
import type { Account } from '$lib/server/accounts/accountRecord';
import type { ConversationMessage } from '$lib/server/conversations/messageRecord';
import type { Goal } from '$lib/server/goals/goalRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export const noSuchGoal = 'No goal you can reach has that id. Call find_goals on the project first.';

export function goalLine(goal: Goal): string {
	const measure = goal.measure === '' ? 'no measure written yet' : `measured by: ${goal.measure}`;
	return `${goal.title} — ${goalStatusLabels[goal.status]}, ${measure} (id: ${goal.id})`;
}

export function describeGoal(
	goal: Goal,
	tasks: ProjectTask[],
	messages: ConversationMessage[],
	accounts: Account[]
): string {
	return [goalLine(goal), '', ...taskLines(tasks), '', ...threadLines(messages, accounts)].join('\n');
}

function taskLines(tasks: ProjectTask[]): string[] {
	if (tasks.length === 0) return ['Tasks under this goal: none yet.'];
	return ['Tasks under this goal:', ...tasks.map(taskLine)];
}

export function taskLine(task: ProjectTask): string {
	const kind = taskKindLabels[task.kind];
	const status = taskStatusLabelFor(task.kind, task.status);
	return `- ${task.title} — ${kind} task, ${status} (id: ${task.id})`;
}
