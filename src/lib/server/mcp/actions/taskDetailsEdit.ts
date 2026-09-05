import { fibonacciStoryPoints } from '$lib/data/storyPoints';
import { parseCompletionPercent } from '$lib/data/completionClamp';
import { readOptionalText } from '../actionTypes';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { TaskDetailsUpdate } from '$lib/server/projects/updateTaskDetails';

export const wrongStoryPoints =
	`Story points go ${fibonacciStoryPoints.join(', ')}. Pick the nearest one.`;

export function readTaskDetailsEdit(
	input: Record<string, unknown>,
	task: ProjectTask
): TaskDetailsUpdate | null {
	const storyPoints = readStoryPoints(input, task);
	if (storyPoints === null) return null;
	return {
		...task,
		title: readOptionalText(input, 'title') ?? task.title,
		details: readOptionalText(input, 'details') ?? task.details,
		dueDate: readOptionalText(input, 'dueDate') ?? task.dueDate,
		phaseId: readOptionalText(input, 'phaseId') ?? task.phaseId,
		storyPoints,
		completionPercent: readCompletionPercent(input, task)
	};
}

function readStoryPoints(input: Record<string, unknown>, task: ProjectTask): number | null {
	const chosen = input.storyPoints;
	if (chosen === undefined || chosen === null) return task.storyPoints;
	return fibonacciStoryPoints.find((points) => points === Number(chosen)) ?? null;
}

function readCompletionPercent(input: Record<string, unknown>, task: ProjectTask): number {
	const chosen = input.completionPercent;
	if (chosen === undefined || chosen === null) return task.completionPercent;
	return parseCompletionPercent(chosen);
}
