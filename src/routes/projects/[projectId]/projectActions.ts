import { fail } from '@sveltejs/kit';
import { readProjectDetailsForm, updateProjectDetails } from '$lib/server/projects/updateProjectDetails';
import { requireProjectAccess } from '$lib/server/auth/requireProjectAccess';
import type { Actions } from './$types';

export const projectActions = {
	updateProject: async ({ locals, params, request }) => {
		await requireProjectAccess(locals, params.projectId);
		const edit = readProjectDetailsForm(await request.formData());
		if (edit === null) return fail(400, { message: 'A project name is required.' });
		await updateProjectDetails(locals.supabase, params.projectId, edit);
		return { message: `Project "${edit.name}" saved.` };
	}
} satisfies Actions;
