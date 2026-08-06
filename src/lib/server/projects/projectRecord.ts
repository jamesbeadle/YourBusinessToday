import { parseProjectStatus, type ProjectStatus } from '$lib/data/projectStatus';

export type Project = {
	id: string;
	name: string;
	description: string;
	status: ProjectStatus;
	priority: number;
	createdAt: string;
};

export function parseProjectRecord(row: Record<string, unknown>): Project {
	return {
		id: row.id as string,
		name: row.name as string,
		description: row.description as string,
		status: parseProjectStatus(row.status),
		priority: row.priority as number,
		createdAt: row.created_at as string
	};
}
