import { createHash } from 'node:crypto';
import { hashSecret, issueTokensFor, type IssuedTokens } from './oauthTokens';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';

export type ExchangeFailure = 'invalid_grant';

export async function exchangeAuthorizationCode(
	code: string,
	clientId: string,
	redirectUri: string,
	codeVerifier: string
): Promise<IssuedTokens | ExchangeFailure> {
	const supabase = supabaseServiceClient();
	const codeHash = hashSecret(code);
	const { data, error } = await supabase
		.from('oauth_authorization_codes')
		.select('*')
		.eq('code_hash', codeHash)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return 'invalid_grant';
	if (!isCodeUsable(data, clientId, redirectUri, codeVerifier)) return 'invalid_grant';
	await markCodeUsed(supabase, codeHash);
	return issueTokensFor(supabase, clientId, data.account_id);
}

function isCodeUsable(
	code: Record<string, any>,
	clientId: string,
	redirectUri: string,
	codeVerifier: string
): boolean {
	if (code.used_at !== null) return false;
	if (new Date(code.expires_at).getTime() < Date.now()) return false;
	if (code.client_id !== clientId) return false;
	if (code.redirect_uri !== redirectUri) return false;
	return challengeFor(codeVerifier) === code.code_challenge;
}

function challengeFor(codeVerifier: string): string {
	return createHash('sha256').update(codeVerifier).digest('base64url');
}

async function markCodeUsed(
	supabase: ReturnType<typeof supabaseServiceClient>,
	codeHash: string
): Promise<void> {
	const { error } = await supabase
		.from('oauth_authorization_codes')
		.update({ used_at: new Date().toISOString() })
		.eq('code_hash', codeHash);
	if (error) throw error;
}
