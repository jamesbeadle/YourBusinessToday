import { getHiveMembers } from '$lib/server/hive/getHiveMembers';
import { getRecentHiveQuestions } from '$lib/server/hive/getRecentHiveQuestions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	return {
		members: await getHiveMembers(locals.supabase),
		recentQuestions: user === null ? [] : await getRecentHiveQuestions(locals.supabase),
		isSignedIn: user !== null
	};
};
