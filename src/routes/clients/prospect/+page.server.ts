import { isCompaniesHouseConfigured } from '$lib/server/companiesHouse/companiesHouseRequest';
import { prospectFormActions } from '$lib/server/clients/prospectFormActions';
import {
	readCompaniesHouseSearch,
	searchCompaniesHouse,
	type CompaniesHouseCompany
} from '$lib/server/companiesHouse/searchCompaniesHouse';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	await requireStaff(locals);
	const search = readCompaniesHouseSearch(url.searchParams);
	const isConfigured = isCompaniesHouseConfigured();
	return {
		isConfigured,
		search,
		companies: await resultsFor(search, isConfigured)
	};
};

async function resultsFor(
	search: ReturnType<typeof readCompaniesHouseSearch>,
	isConfigured: boolean
): Promise<CompaniesHouseCompany[] | null> {
	if (search === null || !isConfigured) return null;
	return searchCompaniesHouse(search);
}

export const actions: Actions = { ...prospectFormActions };
