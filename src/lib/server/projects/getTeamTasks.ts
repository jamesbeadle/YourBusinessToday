import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord } from '$lib/server/projects/taskRecord';
import type { GlobalTask } from '$lib/server/projects/getGlobalTaskPage';

/** The open tasks assigned to one person on projects other people own, soonest due first. */
export async function getTeamTasks(
	supabase: SupabaseClient,
	accountId: string
): Promise<GlobalTask[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*, projects!inner(name, owner_id), task_assignees!inner(profile_id)')
		.eq('task_assignees.profile_id', accountId)
		.neq('projects.owner_id', accountId)
		.neq('status', 'done')
		.order('due_date', { ascending: true, nullsFirst: false })
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		...parseTaskRecord(row),
		projectName: (row.projects as { name: string }).name
	}));
}
