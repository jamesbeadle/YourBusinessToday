import type { SupabaseClient } from '@supabase/supabase-js';
import type { TaskStatus } from '$lib/data/taskStatus';

export async function updateTaskStatus(
	supabase: SupabaseClient,
	taskId: string,
	status: TaskStatus
): Promise<void> {
	const update = status === 'done' ? { status, completion_percent: 100 } : { status };
	const { error } = await supabase.from('tasks').update(update).eq('id', taskId);
	if (error) throw error;
}
