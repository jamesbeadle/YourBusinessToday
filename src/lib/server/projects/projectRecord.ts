import { parseProjectStatus, type ProjectStatus } from '$lib/data/projectStatus';

export type Project = {
	id: string;
	ownerId: string;
	name: string;
	description: string;
	status: ProjectStatus;
	priority: number;
	clientId: string | null;
	repositoryUrl: string;
	environmentUrl: string;
	createdAt: string;
};

export function parseProjectRecord(row: Record<string, unknown>): Project {
	return {
		id: row.id as string,
		ownerId: row.owner_id as string,
		name: row.name as string,
		description: row.description as string,
		status: parseProjectStatus(row.status),
		priority: row.priority as number,
		clientId: (row.client_id as string) ?? null,
		repositoryUrl: (row.repository_url as string) ?? '',
		environmentUrl: (row.environment_url as string) ?? '',
		createdAt: row.created_at as string
	};
}
