import { fail } from '@sveltejs/kit';
import { createProject } from '$lib/server/projects/createProject';
import { getProjectList } from '$lib/server/projects/getProjectList';
import { moveProject, type ProjectMoveDirection } from '$lib/server/projects/moveProject';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { setProjectArchived } from '$lib/server/projects/setProjectArchived';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireStaff(locals);
	return { projects: await getProjectList(locals.supabase) };
};

export const actions: Actions = {
	createProject: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();
		if (name === '') return fail(400, { message: 'A project name is required.' });
		await createProject(locals.supabase, name, description, user.id);
		return { message: `Project "${name}" created.` };
	},
	moveProject: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const projectId = String(formData.get('projectId') ?? '');
		const direction = String(formData.get('direction')) as ProjectMoveDirection;
		if (projectId === '') return fail(400, { message: 'A project is required.' });
		await moveProject(locals.supabase, projectId, direction);
		return {};
	},
	setArchived: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const projectId = String(formData.get('projectId') ?? '');
		const shouldArchive = String(formData.get('shouldArchive')) === 'true';
		if (projectId === '') return fail(400, { message: 'A project is required.' });
		await setProjectArchived(locals.supabase, projectId, shouldArchive);
		return {};
	}
};
