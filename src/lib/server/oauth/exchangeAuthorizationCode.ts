import { createHash } from 'node:crypto';
import { hashSecret, issueTokensFor, type IssuedTokens } from './oauthTokens';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ExchangeFailure = 'invalid_grant';

type ClaimedCode = {
	account_id: string;
	client_id: string;
	redirect_uri: string;
	code_challenge: string;
	expires_at: string;
};

export async function exchangeAuthorizationCode(
	code: string,
	clientId: string,
	redirectUri: string,
	codeVerifier: string
): Promise<IssuedTokens | ExchangeFailure> {
	const supabase = supabaseServiceClient();
	const claimedCode = await claimCode(supabase, hashSecret(code));
	if (claimedCode === null) return 'invalid_grant';
	if (!isCodeUsable(claimedCode, clientId, redirectUri, codeVerifier)) return 'invalid_grant';
	return issueTokensFor(supabase, clientId, claimedCode.account_id);
}

// Claiming is one conditional update, so a code presented twice at once is
// spent exactly once, and a code that fails its checks is spent rather than
// left open for another try.
async function claimCode(supabase: SupabaseClient, codeHash: string): Promise<ClaimedCode | null> {
	const { data, error } = await supabase
		.from('oauth_authorization_codes')
		.update({ used_at: new Date().toISOString() })
		.eq('code_hash', codeHash)
		.is('used_at', null)
		.select('account_id, client_id, redirect_uri, code_challenge, expires_at')
		.maybeSingle();
	if (error) throw error;
	return data;
}

function isCodeUsable(
	claimedCode: ClaimedCode,
	clientId: string,
	redirectUri: string,
	codeVerifier: string
): boolean {
	if (new Date(claimedCode.expires_at).getTime() < Date.now()) return false;
	if (claimedCode.client_id !== clientId) return false;
	if (redirectUri !== '' && claimedCode.redirect_uri !== redirectUri) return false;
	return challengeFor(codeVerifier) === claimedCode.code_challenge;
}

function challengeFor(codeVerifier: string): string {
	return createHash('sha256').update(codeVerifier).digest('base64url');
}
