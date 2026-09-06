import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './createClient';
import { emptyCompanyProfile } from './companyProfile';

export type ProspectSeed = { name: string; companyNumber: string; address: string };

export type AddProspectOutcome = { clientId: string; wasAlreadyListed: boolean };

export function readProspectSeed(formData: FormData): ProspectSeed | null {
	const name = String(formData.get('name') ?? '').trim();
	const companyNumber = String(formData.get('companyNumber') ?? '').trim();
	if (name === '' || companyNumber === '') return null;
	return { name, companyNumber, address: String(formData.get('address') ?? '').trim() };
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
				location: prospect.address
			}
		},
		actorAccountId
	);
	return { clientId, wasAlreadyListed: false };
}

// A lead typed in by hand never captured a company number, so the same
// company arriving from Companies House claims that row instead of a new one.
async function findNumberlessClientByName(
	supabase: SupabaseClient,
	name: string
): Promise<string | null> {
	const { data, error } = await supabase
		.from('clients')
		.select('id')
		.ilike('name', name)
		.eq('company_number', '')
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return data.id as string;
}

async function stampCompanyNumber(
	supabase: SupabaseClient,
	clientId: string,
	companyNumber: string
): Promise<void> {
	const { error } = await supabase
		.from('clients')
		.update({ company_number: companyNumber })
		.eq('id', clientId);
	if (error) throw error;
}

async function findClientByCompanyNumber(
	supabase: SupabaseClient,
	companyNumber: string
): Promise<string | null> {
	const { data, error } = await supabase
		.from('clients')
		.select('id')
		.eq('company_number', companyNumber)
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return data.id as string;
}
