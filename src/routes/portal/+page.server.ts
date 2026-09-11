import { getDisplayName } from '$lib/server/auth/getDisplayName';
import { requireProjectMember } from '$lib/server/auth/requireProjectMember';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const membership = await requireProjectMember(locals);
	const displayName = await getDisplayName(locals.supabase);
	return {
		memberName: displayName === '' ? (membership.user.email ?? '') : displayName,
		projects: membership.projects
	};
};
