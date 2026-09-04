import { fail } from '@sveltejs/kit';
import { createPhase } from '$lib/server/projects/createPhase';
import { deletePhase } from '$lib/server/projects/deletePhase';
import { parseProjectStatus } from '$lib/data/projectStatus';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateProjectDetails } from '$lib/server/projects/updateProjectDetails';
import type { Actions } from './$types';

export const projectActions: Actions = {
	updateProject: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'A project name is required.' });
		await updateProjectDetails(locals.supabase, params.projectId, {
			name,
			description: String(formData.get('description') ?? '').trim(),
			status: parseProjectStatus(formData.get('status'))
		});
		return { message: `Project "${name}" saved.` };
	},
	createPhase: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'A phase name is required.' });
		await createPhase(locals.supabase, params.projectId, name);
		return { message: `Phase "${name}" added.` };
	},
	deletePhase: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const phaseId = String(formData.get('phaseId') ?? '');
		if (phaseId === '') return fail(400, { message: 'A phase is required.' });
		await deletePhase(locals.supabase, phaseId);
		return {};
	}
};
