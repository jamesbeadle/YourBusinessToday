import { mintApiToken } from '$lib/server/tokens/apiToken';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ClientApiToken = {
	id: string;
	name: string;
	tokenHint: string;
	createdAt: string;
	lastUsedAt: string | null;
};

export async function createClientApiToken(
	supabase: SupabaseClient,
	contactId: string,
	name: string
): Promise<string> {
	const minted = mintApiToken();
	const { error } = await supabase.from('client_api_tokens').insert({
		contact_id: contactId,
		name,
		token_hash: minted.tokenHash,
		token_hint: minted.tokenHint
	});
	if (error) throw error;
	return minted.token;
}

export async function getClientApiTokens(
	supabase: SupabaseClient,
	contactId: string
): Promise<ClientApiToken[]> {
	const { data, error } = await supabase
		.from('client_api_tokens')
		.select('id, name, token_hint, created_at, last_used_at')
		.eq('contact_id', contactId)
		.is('revoked_at', null)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		name: row.name as string,
		tokenHint: row.token_hint as string,
		createdAt: row.created_at as string,
		lastUsedAt: (row.last_used_at ?? null) as string | null
	}));
}

export async function revokeClientApiToken(
	supabase: SupabaseClient,
	tokenId: string
): Promise<void> {
	const { error } = await supabase
		.from('client_api_tokens')
		.update({ revoked_at: new Date().toISOString() })
		.eq('id', tokenId);
	if (error) throw error;
}
