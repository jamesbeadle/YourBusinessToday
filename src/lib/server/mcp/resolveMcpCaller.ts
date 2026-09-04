import { bearerToken } from '$lib/server/tokens/apiToken';
import { hashSecret } from '$lib/server/oauth/oauthTokens';
import { hashApiToken } from '$lib/server/tokens/apiToken';
import { resolveAccountStanding, type AccountStanding } from './resolveAccountStanding';
import { parseClientContactRecord } from '$lib/server/clients/clientContactRecord';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { SupabaseClient } from '@supabase/supabase-js';

export type McpCaller = AccountStanding & { supabase: SupabaseClient };

const accessTokenPrefix = 'ybt_at_';

// Two ways in: an OAuth access token, which resolves to whoever signed in and
// carries their standing — staff or client contact; and a client access token
// pasted into a config, which can only ever be a contact.
export async function resolveMcpCaller(request: Request): Promise<McpCaller | null> {
	const token = bearerToken(request);
	if (token === '') return null;
	const supabase = supabaseServiceClient();
	if (token.startsWith(accessTokenPrefix)) return resolveOauthCaller(supabase, token);
	return resolveContactTokenCaller(supabase, token);
}

async function resolveOauthCaller(
	supabase: SupabaseClient,
	token: string
): Promise<McpCaller | null> {
	const { data, error } = await supabase
		.from('oauth_tokens')
		.select('id, account_id, kind, expires_at, revoked_at')
		.eq('token_hash', hashSecret(token))
		.maybeSingle();
	if (error) throw error;
	if (data === null || data.kind !== 'access' || data.revoked_at !== null) return null;
	if (new Date(data.expires_at).getTime() < Date.now()) return null;
	await stampUse(supabase, 'oauth_tokens', data.id);
	const standing = await resolveAccountStanding(supabase, data.account_id);
	if (standing.role === 'none') return null;
	return { ...standing, supabase };
}

async function resolveContactTokenCaller(
	supabase: SupabaseClient,
	token: string
): Promise<McpCaller | null> {
	const { data, error } = await supabase
		.from('client_api_tokens')
		.select('id, revoked_at, client_contacts(*)')
		.eq('token_hash', hashApiToken(token))
		.maybeSingle();
	if (error) throw error;
	if (data === null || data.revoked_at !== null) return null;
	await stampUse(supabase, 'client_api_tokens', data.id);
	const contact = parseClientContactRecord(data.client_contacts as unknown as Record<string, unknown>);
	return {
		supabase,
		accountId: contact.accountId ?? '',
		email: contact.email,
		role: 'contact',
		isAdmin: false,
		contact
	};
}

async function stampUse(
	supabase: SupabaseClient,
	table: string,
	rowId: string
): Promise<void> {
	const { error } = await supabase
		.from(table)
		.update({ last_used_at: new Date().toISOString() })
		.eq('id', rowId);
	if (error) throw error;
}
