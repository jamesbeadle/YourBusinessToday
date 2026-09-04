import { error, fail } from '@sveltejs/kit';
import { commentOnFeatureRequest } from '$lib/server/requests/commentOnFeatureRequest';
import { getRequestComments } from '$lib/server/requests/getRequestComments';
import { getRequestForContact } from '$lib/server/requests/getRequestForContact';
import { requireClientContact } from '$lib/server/auth/requireClientContact';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const contact = await requireClientContact(locals);
	const featureRequest = await getRequestForContact(locals.supabase, params.requestId);
	if (featureRequest === null) error(404, 'That request could not be found');
	return {
		featureRequest,
		comments: await getRequestComments(locals.supabase, featureRequest.id),
		accountId: contact.accountId
	};
};

export const actions: Actions = {
	comment: async ({ locals, params, request }) => {
		const contact = await requireClientContact(locals);
		if (contact.accountId === null) return fail(403, { message: 'Your account is not linked yet.' });
		const body = String((await request.formData()).get('body') ?? '').trim();
		if (body === '') return fail(400, { message: 'Write something first.' });
		await commentOnFeatureRequest(locals.supabase, params.requestId, contact.accountId, body);
		return { message: 'Reply posted.' };
	}
};
