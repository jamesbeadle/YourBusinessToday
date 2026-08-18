import type { SupabaseClient } from '@supabase/supabase-js';

export async function addChecklistItem(
	supabase: SupabaseClient,
	checklistId: string,
	description: string
): Promise<void> {
	const nextPosition = (await getHighestPosition(supabase, checklistId)) + 1;
	const { error } = await supabase
		.from('task_checklist_items')
		.insert({ checklist_id: checklistId, description, position: nextPosition });
	if (error) throw error;
}

async function getHighestPosition(supabase: SupabaseClient, checklistId: string): Promise<number> {
	const { data, error } = await supabase
		.from('task_checklist_items')
		.select('position')
		.eq('checklist_id', checklistId)
		.order('position', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.position ?? 0;
}
