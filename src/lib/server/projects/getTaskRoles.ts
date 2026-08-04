import type { SupabaseClient } from '@supabase/supabase-js';

export async function getTaskRoles(supabase: SupabaseClient, taskId: string): Promise<string[]> {
	const { data, error } = await supabase
		.from('task_roles')
		.select('role')
		.eq('task_id', taskId)
		.order('role', { ascending: true });
	if (error) throw error;
	return data.map((row: { role: string }) => row.role);
}
