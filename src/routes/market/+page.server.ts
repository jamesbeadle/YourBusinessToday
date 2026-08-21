import { getBrainSubscriptions, getPurchasedEditions } from '$lib/server/market/getMyPurchases';
import { getPublishedListings } from '$lib/server/market/getPublishedListings';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await requireUser(locals);
	return {
		listings: await getPublishedListings(locals.supabase, user.id),
		purchasedEditions: await getPurchasedEditions(locals.supabase, user.id),
		subscriptions: await getBrainSubscriptions(locals.supabase, user.id)
	};
};
