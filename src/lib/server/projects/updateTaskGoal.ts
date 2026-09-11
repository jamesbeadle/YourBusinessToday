import type { SupabaseClient } from '@supabase/supabase-js';

export async function updateTaskGoal(
	supabase: SupabaseClient,
	taskId: string,
	goalId: string | null
): Promise<void> {
	const { error } = await supabase.from('tasks').update({ goal_id: goalId }).eq('id', taskId);
	if (error) throw error;
}
