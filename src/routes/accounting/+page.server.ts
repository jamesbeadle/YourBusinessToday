import { getAccountingOverview } from '$lib/server/accounting/getAccountingOverview';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { overview: await getAccountingOverview(locals.supabase) };
};
