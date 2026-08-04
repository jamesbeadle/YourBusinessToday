import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { getUnreadNotificationCount } from '$lib/server/notifications/getUnreadNotificationCount';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) {
		return {
			userEmail: null,
			creditBalance: null,
			isAdmin: false,
			isStaff: false,
			unreadNotificationCount: 0
		};
	}
	const profileFlags = await getProfileFlags(locals.supabase);
	const isProjectManager = profileFlags.isStaff || profileFlags.isAdmin;
	return {
		userEmail: user.email ?? '',
		creditBalance: await getCreditBalance(locals.supabase),
		isAdmin: profileFlags.isAdmin,
		isStaff: profileFlags.isStaff,
		unreadNotificationCount: isProjectManager
			? await getUnreadNotificationCount(locals.supabase, user.id)
			: 0
	};
};
