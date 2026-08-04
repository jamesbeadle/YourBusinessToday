export type AcceptanceCriterion = {
	id: string;
	taskId: string;
	description: string;
	isMet: boolean;
	position: number;
};

export function parseCriterionRecord(row: Record<string, unknown>): AcceptanceCriterion {
	return {
		id: row.id as string,
		taskId: row.task_id as string,
		description: row.description as string,
		isMet: row.is_met as boolean,
		position: row.position as number
	};
}
