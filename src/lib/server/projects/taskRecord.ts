import { parseTaskStatus, type TaskStatus } from '$lib/data/taskStatus';

export type ProjectTask = {
	id: string;
	projectId: string;
	title: string;
	details: string;
	status: TaskStatus;
	priority: number;
	dueDate: string | null;
	assigneeId: string | null;
	createdAt: string;
};

export function parseTaskRecord(row: Record<string, unknown>): ProjectTask {
	return {
		id: row.id as string,
		projectId: row.project_id as string,
		title: row.title as string,
		details: row.details as string,
		status: parseTaskStatus(row.status),
		priority: row.priority as number,
		dueDate: (row.due_date as string) ?? null,
		assigneeId: (row.assignee_id as string) ?? null,
		createdAt: row.created_at as string
	};
}
