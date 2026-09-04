import { fail } from '@sveltejs/kit';
import { createClient, readNewClientSeed } from '$lib/server/clients/createClient';
import { getClientList } from '$lib/server/clients/getClientList';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { moveClientStage } from '$lib/server/clients/moveClientStage';
import { parseClientStage } from '$lib/data/clientLifecycle';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireStaff(locals);
	return {
		clients: await getClientList(locals.supabase),
		staffMembers: await getStaffDirectory(locals.supabase)
	};
};

export const actions: Actions = {
	createClient: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const seed = readNewClientSeed(await request.formData(), user.id);
		if (seed === null) return fail(400, { message: 'A client name is required.' });
		await createClient(locals.supabase, seed, user.id);
		return { message: `${seed.name} added as a lead.` };
	},
	moveStage: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const clientId = String(formData.get('clientId') ?? '');
		if (clientId === '') return fail(400, { message: 'A client is required.' });
		await moveClientStage(
			locals.supabase,
			clientId,
			parseClientStage(formData.get('stage')),
			user.id
		);
		return { message: 'Stage updated.' };
	}
};
