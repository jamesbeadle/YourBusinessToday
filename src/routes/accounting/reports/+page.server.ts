import { currentMonthKey } from '$lib/data/accounting/accountingPeriods';
import { getCostCentres } from '$lib/server/accounting/getCostCentres';
import { getMonthlyReports } from '$lib/server/accounting/getMonthlyReports';
import type { PageServerLoad } from './$types';

const monthKeyPattern = /^\d{4}-\d{2}$/;

export const load: PageServerLoad = async ({ locals, url }) => {
	const requestedMonth = url.searchParams.get('month') ?? '';
	const monthKey = monthKeyPattern.test(requestedMonth) ? requestedMonth : currentMonthKey();
	const costCentreId = url.searchParams.get('costCentre') || null;
	return {
		reports: await getMonthlyReports(locals.supabase, monthKey, costCentreId),
		costCentres: await getCostCentres(locals.supabase)
	};
};
