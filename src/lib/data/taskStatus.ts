export type TaskStatus = 'backlog' | 'in_progress' | 'done';

export const taskStatusLabels: Record<TaskStatus, string> = {
	backlog: 'Backlog',
	in_progress: 'In progress',
	done: 'Done'
};

export const taskStatusOrder: TaskStatus[] = ['backlog', 'in_progress', 'done'];

export function parseTaskStatus(value: unknown): TaskStatus {
	if (value === 'in_progress' || value === 'done') return value;
	return 'backlog';
}
