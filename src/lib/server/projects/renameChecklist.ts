import type { SupabaseClient } from '@supabase/supabase-js';

export async function renameChecklist(
	supabase: SupabaseClient,
	checklistId: string,
	title: string
): Promise<void> {
	const { error } = await supabase
		.from('task_checklists')
		.update({ title })
		.eq('id', checklistId);
	if (error) throw error;
}
