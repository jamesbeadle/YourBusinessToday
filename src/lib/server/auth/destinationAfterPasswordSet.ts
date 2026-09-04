import type { SupabaseClient } from '@supabase/supabase-js';
import { defaultDestination } from './localDestination';

const clientPortal = '/portal';

export async function destinationAfterPasswordSet(
	supabase: SupabaseClient,
	accountId: string
): Promise<string> {
	const { data: contact } = await supabase
		.from('client_contacts')
		.select('id')
		.eq('account_id', accountId)
		.maybeSingle();
	const isClientContact = contact !== null;
	if (isClientContact) return clientPortal;
	return defaultDestination;
}
