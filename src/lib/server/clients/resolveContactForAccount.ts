import { parseClientContactRecord, type ClientContact } from './clientContactRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function resolveContactForAccount(
	supabase: SupabaseClient,
	accountId: string
): Promise<ClientContact | null> {
	const { data, error } = await supabase
		.from('client_contacts')
		.select('*')
		.eq('account_id', accountId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseClientContactRecord(data);
}
