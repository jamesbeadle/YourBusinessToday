import { fail } from '@sveltejs/kit';
import { addContactNote } from '$lib/server/clients/addContactNote';
import { composeApproachNote, draftApproach } from '$lib/server/clients/draftApproach';
import { getClient } from '$lib/server/clients/getClient';
import { getPeopleForClient } from '$lib/server/clients/getPeopleForClient';
import { isAnthropicConfigured } from '$lib/server/anthropic/isAnthropicConfigured';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions } from './$types';

export const approachActions: Actions = {
	draftApproach: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		if (!isAnthropicConfigured()) return fail(503, { message: 'Claude is not configured on this server.' });
		const formData = await request.formData();
		const contactId = String(formData.get('contactId') ?? '');
		const client = await getClient(locals.supabase, params.clientId);
		if (client === null) return fail(404, { message: 'That client could not be found.' });
		const people = await getPeopleForClient(locals.supabase, client.id);
		const person = people.find((candidate) => candidate.id === contactId);
		if (person === undefined) return fail(400, { message: 'That person could not be found.' });
		try {
			return { approachDraft: await draftApproach(locals.supabase, client, person, user.id) };
		} catch (failure) {
			return fail(502, { message: (failure as Error).message });
		}
	},
	saveApproach: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const contactId = String(formData.get('contactId') ?? '');
		const openingMessage = String(formData.get('openingMessage') ?? '').trim();
		const callPlan = String(formData.get('callPlan') ?? '').trim();
		if (contactId === '') return fail(400, { message: 'A contact is required.' });
		if (openingMessage === '' && callPlan === '') return fail(400, { message: 'Nothing to save.' });
		const body = composeApproachNote(openingMessage, callPlan);
		await addContactNote(locals.supabase, contactId, 'approach', body, user.id);
		return { message: 'Approach saved to the notes.' };
	}
};
