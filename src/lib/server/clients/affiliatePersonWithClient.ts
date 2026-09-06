import type { SupabaseClient } from '@supabase/supabase-js';
import type { AffiliationSource } from './clientContactRecord';

export type Affiliation = {
	personId: string;
	clientId: string;
	role: string;
	isPrimary: boolean;
	officerRole?: string;
	appointedOn?: string;
	source?: AffiliationSource;
};

export type AffiliationOutcome = 'affiliated' | 'already_affiliated';

const duplicateRowCode = '23505';

export async function affiliatePersonWithClient(
	supabase: SupabaseClient,
	affiliation: Affiliation
): Promise<AffiliationOutcome> {
	if (affiliation.isPrimary) await standDownExistingPrimary(supabase, affiliation.clientId);
	const { error } = await supabase.from('client_contacts').insert({
		person_id: affiliation.personId,
		client_id: affiliation.clientId,
		role: affiliation.role,
		is_primary: affiliation.isPrimary,
		officer_role: affiliation.officerRole ?? '',
		appointed_on: affiliation.appointedOn === '' ? null : (affiliation.appointedOn ?? null),
		affiliation_source: affiliation.source ?? 'staff'
	});
	if (error !== null && error.code === duplicateRowCode) return 'already_affiliated';
	if (error !== null) throw error;
	return 'affiliated';
}

async function standDownExistingPrimary(supabase: SupabaseClient, clientId: string): Promise<void> {
	const { error } = await supabase
		.from('client_contacts')
		.update({ is_primary: false })
		.eq('client_id', clientId)
		.eq('is_primary', true);
	if (error) throw error;
}
