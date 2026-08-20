import { error } from '@sveltejs/kit';
import { getSharedMap, getSharedMapSummaries } from '$lib/server/maps/getSharedMaps';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireUser(locals);
	const model = await getSharedMap(locals.supabase, params.ownerId);
	if (model === null) error(404, 'This map is not shared with you');
	const summaries = await getSharedMapSummaries(locals.supabase);
	const owner = summaries.find((summary) => summary.ownerId === params.ownerId);
	return { model, ownerEmail: owner?.ownerEmail ?? 'Unknown owner' };
};
