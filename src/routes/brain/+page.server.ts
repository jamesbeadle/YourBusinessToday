import { getBrainEvents } from '$lib/server/brain/getBrainEvents';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { getBrainSources } from '$lib/server/brain/getBrainSources';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return {
		sources: await getBrainSources(locals.supabase),
		pageIndex: await getBrainPageIndex(locals.supabase),
		events: await getBrainEvents(locals.supabase)
	};
};
