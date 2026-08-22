import type { SupabaseClient } from '@supabase/supabase-js';

export async function updateTaskPhase(
	supabase: SupabaseClient,
	taskId: string,
	phaseId: string | null
): Promise<void> {
	const { error } = await supabase.from('tasks').update({ phase_id: phaseId }).eq('id', taskId);
	if (error) throw error;
}
