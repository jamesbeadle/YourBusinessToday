import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './createClient';
import { emptyCompanyProfile } from './companyProfile';
import { findClientByCompanyNumber, findNumberlessClientByName, stampCompanyNumber } from './findClientByNumber';
import { postcodeIn } from '$lib/data/postcode';

export type ProspectSeed = { name: string; companyNumber: string; address: string; postcode?: string };

export type AddProspectOutcome = { clientId: string; wasAlreadyListed: boolean };

export function readProspectSeed(formData: FormData): ProspectSeed | null {
	const name = String(formData.get('name') ?? '').trim();
	const companyNumber = String(formData.get('companyNumber') ?? '').trim();
	if (name === '' || companyNumber === '') return null;
	return {
		name,
		companyNumber,
		address: String(formData.get('address') ?? '').trim(),
		postcode: String(formData.get('postcode') ?? '').trim()
	};
}

export async function addProspectAsLead(
	supabase: SupabaseClient,
	prospect: ProspectSeed,
	actorAccountId: string
): Promise<AddProspectOutcome> {
	const existingClientId = await findClientByCompanyNumber(supabase, prospect.companyNumber);
	if (existingClientId !== null) return { clientId: existingClientId, wasAlreadyListed: true };
	const numberlessClientId = await findNumberlessClientByName(supabase, prospect.name);
	if (numberlessClientId !== null) {
		await stampCompanyNumber(supabase, numberlessClientId, prospect.companyNumber);
		return { clientId: numberlessClientId, wasAlreadyListed: true };
	}
	const clientId = await createClient(
		supabase,
		{
			name: prospect.name,
			website: '',
			ownerId: actorAccountId,
			source: 'companies_house',
			profile: {
				...emptyCompanyProfile,
				companyNumber: prospect.companyNumber,
				location: prospect.address,
				postcode: postcodeForProspect(prospect)
			}
		},
		actorAccountId
	);
	return { clientId, wasAlreadyListed: false };
}

function postcodeForProspect(prospect: ProspectSeed): string {
	const given = postcodeIn(prospect.postcode ?? '');
	if (given !== '') return given;
	return postcodeIn(prospect.address);
}
