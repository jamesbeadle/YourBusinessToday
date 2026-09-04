import { fail, redirect } from '@sveltejs/kit';
import { getClientProjects } from '$lib/server/clients/getClientProjects';
import { raiseFeatureRequest } from '$lib/server/requests/raiseFeatureRequest';
import { readRaiseRequestSeed } from '$lib/server/requests/readRaiseRequestSeed';
import { requireClientContact } from '$lib/server/auth/requireClientContact';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const contact = await requireClientContact(locals);
	return {
		projects: await getClientProjects(locals.supabase, contact.clientId),
		chosenProjectId: url.searchParams.get('projectId') ?? ''
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const contact = await requireClientContact(locals);
		const seed = readRaiseRequestSeed(await request.formData());
		if (seed === null) {
			return fail(400, { message: 'A project, a title and what you want are all required.' });
		}
		const result = await raiseFeatureRequest(locals.supabase, contact, seed);
		if (result.outcome === 'not_your_project') {
			return fail(403, { message: 'That project is not one of yours.' });
		}
		redirect(303, `/portal/requests/${result.requestId}`);
	}
};
