import type { SupabaseClient } from '@supabase/supabase-js';

export async function createChecklist(
	supabase: SupabaseClient,
	taskId: string,
	title: string
): Promise<void> {
	const nextPosition = (await getHighestPosition(supabase, taskId)) + 1;
	const { error } = await supabase
		.from('task_checklists')
		.insert({ task_id: taskId, title, position: nextPosition });
	if (error) throw error;
}

async function getHighestPosition(supabase: SupabaseClient, taskId: string): Promise<number> {
	const { data, error } = await supabase
		.from('task_checklists')
		.select('position')
		.eq('task_id', taskId)
		.order('position', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.position ?? 0;
}
