import { error, fail } from '@sveltejs/kit';
import { createSprint } from '$lib/server/projects/createSprint';
import { deleteSprint } from '$lib/server/projects/deleteSprint';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectSprints } from '$lib/server/projects/getProjectSprints';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getSprintSummaries } from '$lib/server/projects/getSprintSummaries';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const project = await getProject(locals.supabase, params.projectId);
	if (project === null) error(404, 'Project not found');
	const sprints = await getProjectSprints(locals.supabase, params.projectId);
	const tasks = await getProjectTasks(locals.supabase, params.projectId);
	return { project, sprintSummaries: getSprintSummaries(sprints, tasks) };
};

export const actions: Actions = {
	createSprint: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'A sprint name is required.' });
		await createSprint(
			locals.supabase,
			params.projectId,
			name,
			emptyAsNull(String(formData.get('startsOn') ?? '')),
			emptyAsNull(String(formData.get('endsOn') ?? ''))
		);
		return { message: `Sprint "${name}" created.` };
	},
	deleteSprint: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const sprintId = String(formData.get('sprintId') ?? '');
		if (sprintId === '') return fail(400, { message: 'A sprint is required.' });
		await deleteSprint(locals.supabase, sprintId);
		return {};
	}
};

function emptyAsNull(value: string): string | null {
	if (value === '') return null;
	return value;
}
