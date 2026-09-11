import { redirect } from '@sveltejs/kit';
import { getMemberProjects } from '$lib/server/members/getMemberProjects';
import { requireUser } from './requireUser';
import type { Project } from '$lib/server/projects/projectRecord';
import type { User } from '@supabase/supabase-js';

export type ProjectMembership = { user: User; projects: Project[] };

export async function requireProjectMember(locals: App.Locals): Promise<ProjectMembership> {
	const user = await requireUser(locals);
	const projects = await getMemberProjects(locals.supabase, user.id);
	if (projects.length === 0) redirect(303, '/');
	return { user, projects };
}
