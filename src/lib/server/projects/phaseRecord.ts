export type Phase = {
	id: string;
	projectId: string;
	name: string;
	position: number;
};

export function parsePhaseRecord(row: Record<string, unknown>): Phase {
	return {
		id: row.id as string,
		projectId: row.project_id as string,
		name: row.name as string,
		position: row.position as number
	};
}
