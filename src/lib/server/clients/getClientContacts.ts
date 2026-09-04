import type { SupabaseClient } from '@supabase/supabase-js';
import { parseClientContactRecord, type ClientContact } from './clientContactRecord';

export async function getClientContacts(
	supabase: SupabaseClient,
	clientId: string
): Promise<ClientContact[]> {
	const { data, error } = await supabase
		.from('client_contacts')
		.select('*')
		.eq('client_id', clientId)
		.order('is_primary', { ascending: false })
		.order('name');
	if (error) throw error;
	return data.map(parseClientContactRecord);
}

export async function getClientContact(
	supabase: SupabaseClient,
	contactId: string
): Promise<ClientContact | null> {
	const { data, error } = await supabase
		.from('client_contacts')
		.select('*')
		.eq('id', contactId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseClientContactRecord(data);
}
