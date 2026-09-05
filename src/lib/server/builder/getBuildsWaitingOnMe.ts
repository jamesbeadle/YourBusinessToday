import { parseTaskRecord } from '$lib/server/projects/taskRecord';
import type { GlobalTask, GlobalTaskPage } from '$lib/server/projects/getGlobalTaskPage';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getBuildsWaitingOnMe(
	supabase: SupabaseClient,
	ownerId: string
): Promise<GlobalTask[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*, projects!inner(name, owner_id)')
		.eq('projects.owner_id', ownerId)
		.eq('build_status', 'in_review')
		.eq('has_migration', true)
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map((row) => ({
		...parseTaskRecord(row),
		projectName: (row.projects as { name: string }).name
	}));
}

export function singlePageOf(tasks: GlobalTask[]): GlobalTaskPage {
	return { tasks, pageNumber: 1, pageCount: 1, taskCount: tasks.length, firstTaskNumber: 1 };
}
