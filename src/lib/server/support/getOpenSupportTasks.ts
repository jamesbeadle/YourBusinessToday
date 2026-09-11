import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';

export type SupportTaskListing = ProjectTask & { projectName: string };

export async function getOpenSupportTasks(supabase: SupabaseClient): Promise<SupportTaskListing[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*, projects!inner(name)')
		.eq('kind', 'support')
		.neq('status', 'done')
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data.map(toListing);
}

export async function getSupportTasksForClient(
	supabase: SupabaseClient,
	clientId: string
): Promise<SupportTaskListing[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*, projects!inner(name, client_id)')
		.eq('kind', 'support')
		.eq('projects.client_id', clientId)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data.map(toListing);
}

function toListing(row: Record<string, unknown>): SupportTaskListing {
	const project = row.projects as { name: string };
	return { ...parseTaskRecord(row), projectName: project.name };
}
