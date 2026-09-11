import { fail } from '@sveltejs/kit';
import { parseProjectStatus } from '$lib/data/projectStatus';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateProjectDetails } from '$lib/server/projects/updateProjectDetails';
import type { Actions } from './$types';

export const projectActions = {
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
	}
} satisfies Actions;
