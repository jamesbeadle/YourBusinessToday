import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

export type TeamProject = Project & { ownerName: string; openTaskCount: number };

/** The projects one person is on but does not own, with who owns each. */
export async function getTeamProjects(
	supabase: SupabaseClient,
	accountId: string
): Promise<TeamProject[]> {
	const { data, error } = await supabase.rpc('team_projects', { member: accountId });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		...parseProjectRecord(row.project as Record<string, unknown>),
		ownerName: row.owner_name as string,
		openTaskCount: row.open_task_count as number
	}));
}
