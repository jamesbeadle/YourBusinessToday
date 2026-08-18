import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteChecklistItem(
	supabase: SupabaseClient,
	itemId: string
): Promise<void> {
	const { error } = await supabase.from('task_checklist_items').delete().eq('id', itemId);
	if (error) throw error;
}
