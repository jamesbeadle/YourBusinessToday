import { bearerToken, hashApiToken } from '$lib/server/tokens/apiToken';
import { hashSecret } from '$lib/server/oauth/oauthTokens';
import { resolveAccountStanding, type AccountStanding } from './resolveAccountStanding';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { SupabaseClient } from '@supabase/supabase-js';

export type McpCaller = AccountStanding & { supabase: SupabaseClient };

const accessTokenPrefix = 'ybt_at_';

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
	return callerFor(supabase, data.account_id);
}

async function resolveContactTokenCaller(
	supabase: SupabaseClient,
	token: string
): Promise<McpCaller | null> {
	const { data, error } = await supabase
		.from('client_api_tokens')
		.select('id, revoked_at, client_contacts(account_id)')
		.eq('token_hash', hashApiToken(token))
		.maybeSingle();
	if (error) throw error;
	if (data === null || data.revoked_at !== null) return null;
	const contact = data.client_contacts as unknown as { account_id: string | null } | null;
	if (contact === null || contact.account_id === null) return null;
	await stampUse(supabase, 'client_api_tokens', data.id);
	return callerFor(supabase, contact.account_id);
}

async function callerFor(supabase: SupabaseClient, accountId: string): Promise<McpCaller | null> {
	const standing = await resolveAccountStanding(supabase, accountId);
	if (standing.role === 'none') return null;
	return { ...standing, supabase };
}

async function stampUse(supabase: SupabaseClient, table: string, rowId: string): Promise<void> {
	const { error } = await supabase
		.from(table)
		.update({ last_used_at: new Date().toISOString() })
		.eq('id', rowId);
	if (error) throw error;
}
