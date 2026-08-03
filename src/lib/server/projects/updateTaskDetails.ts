import type { SupabaseClient } from '@supabase/supabase-js';
import type { TaskStatus } from '$lib/data/taskStatus';

export type TaskDetailsUpdate = {
	title: string;
	details: string;
	status: TaskStatus;
	dueDate: string | null;
	assigneeId: string | null;
};

export async function updateTaskDetails(
	supabase: SupabaseClient,
	taskId: string,
	update: TaskDetailsUpdate
): Promise<void> {
	const { error } = await supabase
		.from('tasks')
		.update({
			title: update.title,
			details: update.details,
			status: update.status,
			due_date: update.dueDate,
			assignee_id: update.assigneeId
		})
		.eq('id', taskId);
	if (error) throw error;
}
