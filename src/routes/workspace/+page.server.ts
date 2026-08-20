import { fail, redirect } from '@sveltejs/kit';
import { createEntity } from '$lib/server/entities/createEntity';
import { getEntityList } from '$lib/server/entities/getEntityList';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return { entities: await getEntityList(locals.supabase) };
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
