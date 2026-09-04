import { bearerToken, hashApiToken } from '$lib/server/tokens/apiToken';
import { parseClientContactRecord, type ClientContact } from '$lib/server/clients/clientContactRecord';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ContactCaller = {
	supabase: SupabaseClient;
	contact: ClientContact;
};

// The bearer token is the only identity an MCP call carries, so the client it
// resolves to is pinned here and every tool reads it from the caller rather
// than from its own arguments.
export async function resolveContactCaller(request: Request): Promise<ContactCaller | null> {
	const token = bearerToken(request);
	if (token === '') return null;
	const supabase = supabaseServiceClient();
	const { data, error } = await supabase
		.from('client_api_tokens')
		.select('id, contact_id, revoked_at, client_contacts(*)')
		.eq('token_hash', hashApiToken(token))
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null || data.revoked_at !== null) return null;
	await stampLastUsed(supabase, data.id);
	const contactRow = data.client_contacts as unknown as Record<string, unknown>;
	return { supabase, contact: parseClientContactRecord(contactRow) };
}

async function stampLastUsed(supabase: SupabaseClient, tokenId: string): Promise<void> {
	const { error } = await supabase
		.from('client_api_tokens')
		.update({ last_used_at: new Date().toISOString() })
		.eq('id', tokenId);
	if (error) throw error;
}
