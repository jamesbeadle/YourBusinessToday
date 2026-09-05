import { fail } from '@sveltejs/kit';
import { addProspectAsLead, readProspectSeed } from '$lib/server/clients/addProspectAsLead';
import {
	isCompaniesHouseConfigured,
	readCompaniesHouseSearch,
	searchCompaniesHouse,
	type CompaniesHouseCompany
} from '$lib/server/clients/searchCompaniesHouse';
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

export const actions: Actions = {
	addLead: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const prospect = readProspectSeed(await request.formData());
		if (prospect === null) return fail(400, { message: 'A company name and number are required.' });
		const outcome = await addProspectAsLead(locals.supabase, prospect, user.id);
		if (outcome.wasAlreadyListed) {
			return { message: `${prospect.name} is already on the register.`, clientId: outcome.clientId };
		}
		return { message: `${prospect.name} added as a lead.`, clientId: outcome.clientId };
	}
};
