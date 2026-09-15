import { getOpenSupportTasks } from '$lib/server/support/getOpenSupportTasks';
import { requireUser } from '$lib/server/auth/requireUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await requireUser(locals);
	return { tasks: await getOpenSupportTasks(locals.supabase, user.id) };
};
