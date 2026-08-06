export type TaskDraft = {
	title: string;
	details: string;
	dueDate: string | null;
	assigneeId: string | null;
	parentTaskId: string | null;
};

export function readTaskDraft(formData: FormData): TaskDraft | null {
	const title = String(formData.get('title') ?? '').trim();
	if (title === '') return null;
	return {
		title,
		details: String(formData.get('details') ?? '').trim(),
		dueDate: emptyAsNull(String(formData.get('dueDate') ?? '')),
		assigneeId: emptyAsNull(String(formData.get('assigneeId') ?? '')),
		parentTaskId: emptyAsNull(String(formData.get('parentTaskId') ?? ''))
	};
}

function emptyAsNull(value: string): string | null {
	if (value === '') return null;
	return value;
}
