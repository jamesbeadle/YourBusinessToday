import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { getUnreadNotificationCount } from '$lib/server/notifications/getUnreadNotificationCount';
import { getMemberProjectIds } from '$lib/server/members/getMemberProjectIds';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) {
		return {
			userEmail: null,
			isAdmin: false,
			isStaff: false,
			isProjectMember: false,
			unreadNotificationCount: 0
		};
	}
	const profileFlags = await getProfileFlags(locals.supabase);
	const isProjectManager = profileFlags.isStaff || profileFlags.isAdmin;
	return {
		userEmail: user.email ?? '',
		isAdmin: profileFlags.isAdmin,
		isStaff: profileFlags.isStaff,
		isProjectMember: (await getMemberProjectIds(locals.supabase, user.id)).length > 0,
		unreadNotificationCount: isProjectManager
			? await getUnreadNotificationCount(locals.supabase, user.id)
			: 0
	};
};
