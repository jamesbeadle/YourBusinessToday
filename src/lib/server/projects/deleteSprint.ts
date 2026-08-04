import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteSprint(supabase: SupabaseClient, sprintId: string): Promise<void> {
	const { error } = await supabase.from('sprints').delete().eq('id', sprintId);
	if (error) throw error;
}
