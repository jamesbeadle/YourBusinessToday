import { error } from '@sveltejs/kit';
import { getEntity } from '$lib/server/entities/getEntity';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireUser(locals);
	const entity = await getEntity(locals.supabase, params.entityId);
	if (entity === null) error(404, 'That entity is not in your workspace');
	return { entity };
};
