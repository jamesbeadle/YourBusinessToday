import type { SupabaseClient } from '@supabase/supabase-js';

export async function setTaskRoles(
	supabase: SupabaseClient,
	taskId: string,
	roles: string[]
): Promise<void> {
	const { error: deleteError } = await supabase.from('task_roles').delete().eq('task_id', taskId);
	if (deleteError) throw deleteError;
	if (roles.length === 0) return;
	const roleRows = roles.map((role) => ({ task_id: taskId, role }));
	const { error: insertError } = await supabase.from('task_roles').insert(roleRows);
	if (insertError) throw insertError;
}
