import { getProject } from '$lib/server/projects/getProject';
import type { McpCaller } from './resolveMcpCaller';
import type { Project } from '$lib/server/projects/projectRecord';

export const noReachableProject =
	'No project you can reach has that id. Call list_my_projects for the ones you can.';

export function canReachProject(caller: McpCaller, projectId: string): boolean {
	if (caller.role === 'staff') return true;
	return caller.memberProjectIds.includes(projectId);
}

export function reachableProjectIds(caller: McpCaller): string[] | null {
	if (caller.role === 'staff') return null;
	return caller.memberProjectIds;
}

export async function reachableProject(
	caller: McpCaller,
	projectId: string
): Promise<Project | null> {
	if (!canReachProject(caller, projectId)) return null;
	return getProject(caller.supabase, projectId);
}
