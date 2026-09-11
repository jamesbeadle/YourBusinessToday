import { error } from '@sveltejs/kit';
import { getClient } from '$lib/server/clients/getClient';
import { getClientChildren } from '$lib/server/clients/getClientChildren';
import { getClientEvents } from '$lib/server/clients/getClientEvents';
import { getClientPeople } from '$lib/server/clients/getClientPeople';
import { getClientProjects } from '$lib/server/clients/getClientProjects';
import { getGroupParents } from '$lib/server/clients/getGroupParents';
import { getSupportTasksForClient } from '$lib/server/support/getOpenSupportTasks';
import { getUnassignedProjects } from '$lib/server/projects/getUnassignedProjects';
import { approachFormActions } from '$lib/server/people/approachFormActions';
import { groupActions } from './groupActions';
import { isCompaniesHouseConfigured } from '$lib/server/companiesHouse/companiesHouseRequest';
import { personFormActions } from '$lib/server/people/personFormActions';
import { profileActions } from './profileActions';
import { registerActions } from './registerActions';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const client = await getClient(locals.supabase, params.clientId);
	if (client === null) error(404, 'That client could not be found');
	const [people, projects, supportTasks, unassignedProjects, events, children, parents, parent] =
		await Promise.all([
			getClientPeople(locals.supabase, client.id),
			getClientProjects(locals.supabase, client.id),
			getSupportTasksForClient(locals.supabase, client.id),
			getUnassignedProjects(locals.supabase),
			getClientEvents(locals.supabase, client.id),
			getClientChildren(locals.supabase, client.id),
			getGroupParents(locals.supabase),
			client.parentClientId === null ? null : getClient(locals.supabase, client.parentClientId)
		]);
	return {
		client,
		people,
		projects,
		supportTasks,
		unassignedProjects,
		events,
		children,
		parents,
		parent,
		canImportOfficers: client.profile.companyNumber !== '' && isCompaniesHouseConfigured()
	};
};

export const actions: Actions = {
	...registerActions,
	...profileActions,
	...personFormActions,
	...approachFormActions,
	...groupActions
};
