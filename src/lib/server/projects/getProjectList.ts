import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

export type ProjectSummary = Project & { openTaskCount: number };

export async function getProjectList(
	supabase: SupabaseClient,
	ownerId: string
): Promise<ProjectSummary[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('*, tasks(status)')
		.eq('owner_id', ownerId)
		.order('priority', { ascending: true });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		...parseProjectRecord(row),
		openTaskCount: countOpenTasks(row.tasks as { status: string }[])
	}));
}

function countOpenTasks(taskRows: { status: string }[]): number {
	return taskRows.filter((taskRow) => taskRow.status !== 'done').length;
}
