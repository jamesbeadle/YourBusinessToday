import { getContactPortal } from '$lib/server/requests/getContactPortal';
import { getClient } from '$lib/server/clients/getClient';
import { requireClientContact } from '$lib/server/auth/requireClientContact';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const contact = await requireClientContact(locals);
	const portal = await getContactPortal(locals.supabase, contact);
	return {
		contactName: contact.name,
		clientName: (await getClient(locals.supabase, contact.clientId))?.name ?? '',
		projects: portal.projects,
		requests: portal.requests
	};
};
