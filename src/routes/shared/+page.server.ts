import { getSharedMapSummaries } from '$lib/server/maps/getSharedMaps';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return { sharedMaps: await getSharedMapSummaries(locals.supabase) };
};
