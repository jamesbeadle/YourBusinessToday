import type { SupabaseClient } from '@supabase/supabase-js';
import { toCompanyProfileColumns, type CompanyProfile } from './companyProfile';

export async function updateCompanyProfile(
	supabase: SupabaseClient,
	clientId: string,
	website: string,
	profile: CompanyProfile
): Promise<void> {
	const { error } = await supabase
		.from('clients')
		.update({ website, ...toCompanyProfileColumns(profile) })
		.eq('id', clientId);
	if (error) throw error;
}
