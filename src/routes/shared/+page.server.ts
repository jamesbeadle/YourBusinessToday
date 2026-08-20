import { getSharedWorkflowSummaries } from '$lib/server/maps/getSharedMaps';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await requireUser(locals);
	return {
		userEmail: user.email ?? '',
		sharedWorkflows: await getSharedWorkflowSummaries(locals.supabase)
	};
};
