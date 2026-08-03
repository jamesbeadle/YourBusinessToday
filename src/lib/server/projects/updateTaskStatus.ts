import type { SupabaseClient } from '@supabase/supabase-js';
import type { TaskStatus } from '$lib/data/taskStatus';

export async function updateTaskStatus(
	supabase: SupabaseClient,
	taskId: string,
	status: TaskStatus
): Promise<void> {
	const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
	if (error) throw error;
}
