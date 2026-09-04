import { error, fail } from '@sveltejs/kit';
import { addClientContact, readNewContactSeed } from '$lib/server/clients/addClientContact';
import { getClient } from '$lib/server/clients/getClient';
import { getClientContact, getClientContacts } from '$lib/server/clients/getClientContacts';
import { getClientEvents } from '$lib/server/clients/getClientEvents';
import { getClientProjects } from '$lib/server/clients/getClientProjects';
import { getRequestsForClient } from '$lib/server/requests/getRequestsForClient';
import { getUnassignedProjects } from '$lib/server/projects/getUnassignedProjects';
import { assignProjectToClient, readProjectOwnership } from '$lib/server/projects/assignProjectToClient';
import { inviteClientContact } from '$lib/server/clients/inviteClientContact';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const client = await getClient(locals.supabase, params.clientId);
	if (client === null) error(404, 'That client could not be found');
	return {
		client,
		contacts: await getClientContacts(locals.supabase, client.id),
		projects: await getClientProjects(locals.supabase, client.id),
		requests: await getRequestsForClient(locals.supabase, client.id),
		unassignedProjects: await getUnassignedProjects(locals.supabase),
		events: await getClientEvents(locals.supabase, client.id)
	};
};

export const actions: Actions = {
	addContact: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const seed = readNewContactSeed(await request.formData());
		if (seed === null) return fail(400, { message: 'A name and an email address are required.' });
		const outcome = await addClientContact(locals.supabase, params.clientId, seed, user.id);
		if (outcome === 'already_known') return fail(400, { message: 'That email is already listed.' });
		return { message: `${seed.name} added.` };
	},
	assignProject: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const projectId = String(formData.get('projectId') ?? '');
		if (projectId === '') return fail(400, { message: 'A project is required.' });
		const ownership = { ...readProjectOwnership(formData), clientId: params.clientId };
		await assignProjectToClient(locals.supabase, projectId, ownership, user.id);
		return { message: 'Project assigned.' };
	},
	inviteContact: async ({ locals, request, url }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const contactId = String(formData.get('contactId') ?? '');
		const contact = await getClientContact(locals.supabase, contactId);
		if (contact === null) return fail(400, { message: 'That contact could not be found.' });
		const outcome = await inviteClientContact(locals.supabase, contact, url.origin, user.id);
		if (outcome === 'already_invited') return { message: `${contact.name} already has an account.` };
		return { message: `Invitation sent to ${contact.email}.` };
	}
};
