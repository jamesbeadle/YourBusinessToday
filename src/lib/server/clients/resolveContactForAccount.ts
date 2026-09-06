import { clientContactColumns, parseClientContactRecord, type ClientContact } from './clientContactRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

// A person may be a contact at several companies; the portal follows the
// first company they were invited from, as client_id_for_account() does.
export async function resolveContactForAccount(
	supabase: SupabaseClient,
	accountId: string
): Promise<ClientContact | null> {
	const { data, error } = await supabase
		.from('client_contacts')
		.select(clientContactColumns)
		.eq('account_id', accountId)
		.order('created_at')
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseClientContactRecord(data);
}
