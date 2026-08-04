import type { SupabaseClient } from '@supabase/supabase-js';

export async function setTaskAssignees(
	supabase: SupabaseClient,
	taskId: string,
	profileIds: string[]
): Promise<void> {
	const { error: deleteError } = await supabase
		.from('task_assignees')
		.delete()
		.eq('task_id', taskId);
	if (deleteError) throw deleteError;
	if (profileIds.length === 0) return;
	const assigneeRows = profileIds.map((profileId) => ({
		task_id: taskId,
		profile_id: profileId
	}));
	const { error: insertError } = await supabase.from('task_assignees').insert(assigneeRows);
	if (insertError) throw insertError;
}
