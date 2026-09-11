import { getOpenSupportTasks } from '$lib/server/support/getOpenSupportTasks';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireStaff(locals);
	return { tasks: await getOpenSupportTasks(locals.supabase) };
};
