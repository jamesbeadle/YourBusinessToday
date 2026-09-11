import { getKnowledgeBaseList } from '$lib/server/knowledge/getKnowledgeBaseList';
import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { getUnreadNotificationCount } from '$lib/server/notifications/getUnreadNotificationCount';
import { getMemberProjectIds } from '$lib/server/members/getMemberProjectIds';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) {
		return {
			userEmail: null,
			creditBalance: null,
			isAdmin: false,
			isStaff: false,
			isProjectMember: false,
			unreadNotificationCount: 0,
			knowledgeBases: []
		};
	}
	const profileFlags = await getProfileFlags(locals.supabase);
	const isProjectManager = profileFlags.isStaff || profileFlags.isAdmin;
	return {
		userEmail: user.email ?? '',
		creditBalance: await getCreditBalance(locals.supabase),
		isAdmin: profileFlags.isAdmin,
		isStaff: profileFlags.isStaff,
		isProjectMember: (await getMemberProjectIds(locals.supabase, user.id)).length > 0,
		unreadNotificationCount: isProjectManager
			? await getUnreadNotificationCount(locals.supabase, user.id)
			: 0,
		knowledgeBases: await getKnowledgeBaseList(locals.supabase)
	};
};
