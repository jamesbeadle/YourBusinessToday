import { parseClientContactRecord, type ClientContact } from '$lib/server/clients/clientContactRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type McpRole = 'staff' | 'contact' | 'none';

export type AccountStanding = {
	accountId: string;
	email: string;
	role: McpRole;
	isAdmin: boolean;
	contact: ClientContact | null;
};

export async function resolveAccountStanding(
	supabase: SupabaseClient,
	accountId: string
): Promise<AccountStanding> {
	const { data, error } = await supabase
		.from('profiles')
		.select('email, is_staff, is_admin, is_restricted')
		.eq('id', accountId)
		.maybeSingle();
	if (error) throw error;
	const email = data?.email ?? '';
	if (data?.is_restricted === true) {
		return { accountId, email, role: 'none', isAdmin: false, contact: null };
	}
	if (data?.is_staff === true || data?.is_admin === true) {
		return { accountId, email, role: 'staff', isAdmin: data.is_admin === true, contact: null };
	}
	const contact = await findContact(supabase, accountId);
	if (contact === null) return { accountId, email, role: 'none', isAdmin: false, contact: null };
	return { accountId, email, role: 'contact', isAdmin: false, contact };
}

async function findContact(
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
