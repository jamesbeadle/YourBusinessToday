import { error } from '@sveltejs/kit';
import { getBrainPage } from '$lib/server/brain/getBrainPage';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireUser(locals);
	const page = await getBrainPage(locals.supabase, params.slug);
	if (page === null) error(404, 'That page is not in your Second Brain');
	return { page };
};
