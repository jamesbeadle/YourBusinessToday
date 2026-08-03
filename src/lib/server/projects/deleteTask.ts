import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteTask(supabase: SupabaseClient, taskId: string): Promise<void> {
	const { error } = await supabase.from('tasks').delete().eq('id', taskId);
	if (error) throw error;
}
