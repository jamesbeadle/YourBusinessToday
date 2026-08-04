export type Sprint = {
	id: string;
	projectId: string;
	name: string;
	startsOn: string | null;
	endsOn: string | null;
	createdAt: string;
};

export function parseSprintRecord(row: Record<string, unknown>): Sprint {
	return {
		id: row.id as string,
		projectId: row.project_id as string,
		name: row.name as string,
		startsOn: (row.starts_on as string) ?? null,
		endsOn: (row.ends_on as string) ?? null,
		createdAt: row.created_at as string
	};
}
