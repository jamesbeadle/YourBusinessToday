import { fail } from '@sveltejs/kit';
import { addProspectAsLead, readProspectSeed } from '$lib/server/clients/addProspectAsLead';
import { getClient } from '$lib/server/clients/getClient';
import { importCompanyOfficers } from '$lib/server/clients/importCompanyOfficers';
import { isCompaniesHouseConfigured } from '$lib/server/companiesHouse/companiesHouseRequest';
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
	},
	addLeadWithDirectors: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const prospect = readProspectSeed(await request.formData());
		if (prospect === null) return fail(400, { message: 'A company name and number are required.' });
		const outcome = await addProspectAsLead(locals.supabase, prospect, user.id);
		const client = await getClient(locals.supabase, outcome.clientId);
		if (client === null) return fail(404, { message: 'That client could not be found.' });
		const officers = await importCompanyOfficers(locals.supabase, client, user.id);
		return {
			message: `${prospect.name} on the register with ${officers.importedCount} officer(s) added.`,
			clientId: outcome.clientId
		};
	}
};
