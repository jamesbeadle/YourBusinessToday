import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

export async function getMemberProjects(
	supabase: SupabaseClient,
	accountId: string
): Promise<Project[]> {
	const { data, error } = await supabase
		.from('project_members')
		.select('projects(*)')
		.eq('account_id', accountId);
	if (error) throw error;
	return data
		.map((row: Record<string, unknown>) => row.projects as Record<string, unknown> | null)
		.filter((row): row is Record<string, unknown> => row !== null)
		.map(parseProjectRecord)
		.sort((left, right) => left.name.localeCompare(right.name));
}
