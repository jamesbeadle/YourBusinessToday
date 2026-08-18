import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteChecklist(
	supabase: SupabaseClient,
	checklistId: string
): Promise<void> {
	const { error } = await supabase.from('task_checklists').delete().eq('id', checklistId);
	if (error) throw error;
}
