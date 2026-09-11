import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { TaskStatus } from '$lib/data/taskStatus';

export const resolveInsteadOfClosing =
	'A support task closes with a resolution the person who raised it will read — resolve it instead of marking it done.';

export function statusChangeRefusal(task: ProjectTask, status: TaskStatus): string | null {
	const isClosingUnresolvedSupport =
		task.kind === 'support' && status === 'done' && task.resolution === '';
	if (isClosingUnresolvedSupport) return resolveInsteadOfClosing;
	return null;
}
