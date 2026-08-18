import type { SupabaseClient } from '@supabase/supabase-js';

export async function setChecklistItemDone(
	supabase: SupabaseClient,
	itemId: string,
	isDone: boolean
): Promise<void> {
	const { error } = await supabase
		.from('task_checklist_items')
		.update({ is_done: isDone })
		.eq('id', itemId);
	if (error) throw error;
}
