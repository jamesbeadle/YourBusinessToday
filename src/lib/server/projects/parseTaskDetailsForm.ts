import { parseCompletionPercent } from '$lib/data/completionClamp';
import { parseStoryPoints } from '$lib/data/storyPoints';
import { parseTaskRoles } from '$lib/data/taskRoles';
import { parseTaskStatus } from '$lib/data/taskStatus';
import type { TaskDetailsUpdate } from '$lib/server/projects/updateTaskDetails';

export type TaskDetailsSubmission = TaskDetailsUpdate & {
	assigneeIds: string[];
	roles: string[];
};

export function parseTaskDetailsForm(formData: FormData): TaskDetailsSubmission | null {
	const title = String(formData.get('title') ?? '').trim();
	if (title === '') return null;
	return {
		title,
		details: String(formData.get('details') ?? '').trim(),
		status: parseTaskStatus(formData.get('status')),
		dueDate: emptyAsNull(String(formData.get('dueDate') ?? '')),
		phaseId: emptyAsNull(String(formData.get('phaseId') ?? '')),
		storyPoints: parseStoryPoints(formData.get('storyPoints')),
		completionPercent: parseCompletionPercent(formData.get('completionPercent')),
		isUserStory: formData.get('isUserStory') === 'on',
		storyRole: String(formData.get('storyRole') ?? '').trim(),
		storyWant: String(formData.get('storyWant') ?? '').trim(),
		storyBenefit: String(formData.get('storyBenefit') ?? '').trim(),
		assigneeIds: formData.getAll('assigneeIds').map(String),
		roles: parseTaskRoles(formData.getAll('roles').map(String))
	};
}

function emptyAsNull(value: string): string | null {
	if (value === '') return null;
	return value;
}
