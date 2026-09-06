import type { SupabaseClient } from '@supabase/supabase-js';
import type { LeadSource } from '$lib/data/leadSources';
import { parseSeniority, type Seniority } from '$lib/data/contactProfileFields';
import { findPersonByEmail } from './findPerson';

export type NewPersonSeed = {
	name: string;
	email: string;
	phone: string;
	seniority: Seniority;
	sourceUrl?: string;
	leadSource?: LeadSource;
};

export type AddedPerson = { personId: string; wasAlreadyKnown: boolean };

export function readNewPersonSeed(formData: FormData): NewPersonSeed | null {
	const name = String(formData.get('name') ?? '').trim();
	if (name === '') return null;
	return {
		name,
		email: String(formData.get('email') ?? '').trim().toLowerCase(),
		phone: String(formData.get('phone') ?? '').trim(),
		seniority: parseSeniority(formData.get('seniority'))
	};
}

export async function addPerson(supabase: SupabaseClient, seed: NewPersonSeed): Promise<AddedPerson> {
	const knownPersonId = await findPersonByEmail(supabase, seed.email);
	if (knownPersonId !== null) return { personId: knownPersonId, wasAlreadyKnown: true };
	const { data, error } = await supabase
		.from('people')
		.insert({
			name: seed.name,
			email: seed.email,
			phone: seed.phone,
			seniority: seed.seniority,
			source_url: seed.sourceUrl ?? '',
			lead_source: seed.leadSource ?? 'staff'
		})
		.select('id')
		.single();
	if (error) throw error;
	return { personId: data.id as string, wasAlreadyKnown: false };
}
