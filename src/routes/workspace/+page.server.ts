import { fail, redirect } from '@sveltejs/kit';
import { createEntity } from '$lib/server/entities/createEntity';
import { getEntityList } from '$lib/server/entities/getEntityList';
import { getReceivedInvites } from '$lib/server/sharing/workspaceInvites';
import { getSharedBrains } from '$lib/server/sharing/getSharedBrains';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await requireUser(locals);
	return {
		entities: await getEntityList(locals.supabase, user.id),
		sharedBrains: await getSharedBrains(locals.supabase, user.id),
		invitations: await getReceivedInvites(locals.supabase, user.email ?? '')
	};
};

export const actions: Actions = {
	createEntity: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'An entity needs a name.' });
		const entityId = await createEntity(locals.supabase, name);
		redirect(303, `/workspace/${entityId}`);
	}
};
