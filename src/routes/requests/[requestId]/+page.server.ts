import { error, fail } from '@sveltejs/kit';
import { commentOnFeatureRequest } from '$lib/server/requests/commentOnFeatureRequest';
import { decideFeatureRequest, parseRequestDecision } from '$lib/server/requests/decideFeatureRequest';
import { getClientContact } from '$lib/server/clients/getClientContacts';
import { getFeatureRequest } from '$lib/server/requests/getFeatureRequest';
import { getRequestComments } from '$lib/server/requests/getRequestComments';
import { promoteFeatureRequestToTask } from '$lib/server/requests/promoteFeatureRequestToTask';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const featureRequest = await getFeatureRequest(locals.supabase, params.requestId);
	if (featureRequest === null) error(404, 'That request could not be found');
	return {
		featureRequest,
		comments: await getRequestComments(locals.supabase, featureRequest.id)
	};
};

async function loadRequestOr404(locals: App.Locals, requestId: string) {
	const featureRequest = await getFeatureRequest(locals.supabase, requestId);
	if (featureRequest === null) error(404, 'That request could not be found');
	return featureRequest;
}

export const actions: Actions = {
	comment: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const body = String((await request.formData()).get('body') ?? '').trim();
		if (body === '') return fail(400, { message: 'Write something first.' });
		await commentOnFeatureRequest(locals.supabase, params.requestId, user.id, body);
		return { message: 'Reply posted.' };
	},
	decide: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const featureRequest = await loadRequestOr404(locals, params.requestId);
		const decision = parseRequestDecision(formData.get('decision'));
		const note = String(formData.get('note') ?? '').trim();
		await decideFeatureRequest(locals.supabase, featureRequest, decision, note, user.id);
		return { message: `${featureRequest.reference} ${decision}.` };
	},
	promote: async ({ locals, params }) => {
		const user = await requireStaff(locals);
		const featureRequest = await loadRequestOr404(locals, params.requestId);
		if (featureRequest.taskId !== null) return fail(400, { message: 'Already promoted.' });
		const contact = await getClientContact(locals.supabase, featureRequest.raisedByContactId);
		const role = contact === null ? '' : contact.role;
		await promoteFeatureRequestToTask(locals.supabase, featureRequest, role, user.id);
		return { message: `${featureRequest.reference} is now a task.` };
	}
};
