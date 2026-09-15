export type TaskListFilter = 'open' | 'all' | 'waiting' | 'team';

export const taskListFilterLabels: Record<TaskListFilter, string> = {
	open: 'Open',
	all: 'All',
	waiting: 'Waiting on me',
	team: 'Team'
};

export const taskListFilterOrder: TaskListFilter[] = ['open', 'all', 'waiting', 'team'];

export function parseTaskListFilter(value: string | null): TaskListFilter {
	if (value === 'all' || value === 'waiting' || value === 'team') return value;
	return 'open';
}

export function taskListHref(filter: TaskListFilter): string {
	if (filter === 'open') return '/tasks';
	return `/tasks?status=${filter}`;
}
