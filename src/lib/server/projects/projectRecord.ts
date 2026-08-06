export type Project = {
	id: string;
	name: string;
	description: string;
	isArchived: boolean;
	priority: number;
	createdAt: string;
};

export function parseProjectRecord(row: Record<string, unknown>): Project {
	return {
		id: row.id as string,
		name: row.name as string,
		description: row.description as string,
		isArchived: row.is_archived as boolean,
		priority: row.priority as number,
		createdAt: row.created_at as string
	};
}
