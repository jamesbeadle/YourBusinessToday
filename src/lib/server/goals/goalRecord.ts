import { parseGoalStatus, type GoalStatus } from '$lib/data/goalStatus';

export type Goal = {
	id: string;
	projectId: string;
	title: string;
	measure: string;
	status: GoalStatus;
	priority: number;
	createdBy: string | null;
	createdAt: string;
};

export function parseGoalRecord(row: Record<string, unknown>): Goal {
	return {
		id: row.id as string,
		projectId: row.project_id as string,
		title: row.title as string,
		measure: row.measure as string,
		status: parseGoalStatus(row.status),
		priority: row.priority as number,
		createdBy: (row.created_by as string) ?? null,
		createdAt: row.created_at as string
	};
}
