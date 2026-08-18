export type ChecklistItem = {
	id: string;
	checklistId: string;
	description: string;
	isDone: boolean;
	position: number;
};

export type TaskChecklist = {
	id: string;
	taskId: string;
	title: string;
	position: number;
	items: ChecklistItem[];
};

export function parseChecklistRecord(row: Record<string, unknown>): TaskChecklist {
	return {
		id: row.id as string,
		taskId: row.task_id as string,
		title: row.title as string,
		position: row.position as number,
		items: []
	};
}

export function parseChecklistItemRecord(row: Record<string, unknown>): ChecklistItem {
	return {
		id: row.id as string,
		checklistId: row.checklist_id as string,
		description: row.description as string,
		isDone: row.is_done as boolean,
		position: row.position as number
	};
}
