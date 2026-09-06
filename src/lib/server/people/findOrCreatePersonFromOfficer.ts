import type { SupabaseClient } from '@supabase/supabase-js';
import { findPersonByOfficerId } from './findPerson';

export type OfficerIdentity = { officerId: string; name: string };

const companiesHouseSource = 'companies_house';
const directorSeniority = 'director';

export async function findOrCreatePersonFromOfficer(
	supabase: SupabaseClient,
	officer: OfficerIdentity
): Promise<string> {
	const knownPersonId = await findPersonByOfficerId(supabase, officer.officerId);
	if (knownPersonId !== null) return knownPersonId;
	const { data, error } = await supabase
		.from('people')
		.insert({
			name: officer.name,
			companies_house_officer_id: officer.officerId,
			seniority: directorSeniority,
			lead_source: companiesHouseSource
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id as string;
}
