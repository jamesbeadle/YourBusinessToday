import type { SupabaseClient } from '@supabase/supabase-js';
import { parseClientRecord, type Client } from './clientRecord';

export async function getClient(
	supabase: SupabaseClient,
	clientId: string
): Promise<Client | null> {
	const { data, error } = await supabase
		.from('clients')
		.select('*')
		.eq('id', clientId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseClientRecord(data);
}
