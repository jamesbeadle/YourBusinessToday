import { error } from '@sveltejs/kit';
import { approachActions } from './approachActions';
import { getClient } from '$lib/server/clients/getClient';
import { getClientEvents } from '$lib/server/clients/getClientEvents';
import { getClientProjects } from '$lib/server/clients/getClientProjects';
import { getPeopleForClient } from '$lib/server/clients/getPeopleForClient';
import { getRequestsForClient } from '$lib/server/requests/getRequestsForClient';
import { getUnassignedProjects } from '$lib/server/projects/getUnassignedProjects';
import { personActions } from './personActions';
import { registerActions } from './registerActions';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const client = await getClient(locals.supabase, params.clientId);
	if (client === null) error(404, 'That client could not be found');
	return {
		client,
		people: await getPeopleForClient(locals.supabase, client.id),
		projects: await getClientProjects(locals.supabase, client.id),
		requests: await getRequestsForClient(locals.supabase, client.id),
		unassignedProjects: await getUnassignedProjects(locals.supabase),
		events: await getClientEvents(locals.supabase, client.id)
	};
};

export const actions: Actions = {
	...registerActions,
	...personActions,
	...approachActions
};
