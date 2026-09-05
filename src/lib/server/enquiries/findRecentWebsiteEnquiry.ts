import type { SupabaseClient } from '@supabase/supabase-js';

const websiteSource = 'website';
const oneDayMilliseconds = 24 * 60 * 60 * 1000;

export async function findRecentWebsiteEnquiry(
	supabase: SupabaseClient,
	email: string
): Promise<string | null> {
	const since = new Date(Date.now() - oneDayMilliseconds).toISOString();
	const { data, error } = await supabase
		.from('clients')
		.select('id, client_contacts!inner(email)')
		.eq('lead_source', websiteSource)
		.gt('created_at', since)
		.eq('client_contacts.email', email)
		.order('created_at', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.id ?? null;
}
