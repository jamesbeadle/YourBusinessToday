import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';

export async function getTask(
	supabase: SupabaseClient,
	taskId: string
): Promise<ProjectTask | null> {
	const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseTaskRecord(data);
}
