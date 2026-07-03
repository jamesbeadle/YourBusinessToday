import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) return { userEmail: null, creditBalance: null, isAdmin: false };
	const profileFlags = await getProfileFlags(locals.supabase);
	return {
		userEmail: user.email ?? '',
		creditBalance: await getCreditBalance(locals.supabase),
		isAdmin: profileFlags.isAdmin
	};
};
