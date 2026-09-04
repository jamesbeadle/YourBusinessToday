import { json } from '@sveltejs/kit';
import { exchangeAuthorizationCode } from '$lib/server/oauth/exchangeAuthorizationCode';
import { refreshAccessToken } from '$lib/server/oauth/refreshAccessToken';
import { supportedScope } from '$lib/server/oauth/oauthSettings';
import type { IssuedTokens } from '$lib/server/oauth/oauthTokens';
import type { RequestHandler } from './$types';

const badRequest = 400;

export const POST: RequestHandler = async ({ request }) => {
	const submission = await request.formData();
	const grantType = String(submission.get('grant_type') ?? '');
	const clientId = String(submission.get('client_id') ?? '');
	if (grantType === 'authorization_code') {
		return answer(
			await exchangeAuthorizationCode(
				String(submission.get('code') ?? ''),
				clientId,
				String(submission.get('redirect_uri') ?? ''),
				String(submission.get('code_verifier') ?? '')
			)
		);
	}
	if (grantType === 'refresh_token') {
		return answer(await refreshAccessToken(String(submission.get('refresh_token') ?? ''), clientId));
	}
	return json({ error: 'unsupported_grant_type' }, { status: badRequest });
};

function answer(outcome: IssuedTokens | 'invalid_grant'): Response {
	if (outcome === 'invalid_grant') return json({ error: 'invalid_grant' }, { status: badRequest });
	return json({
		access_token: outcome.accessToken,
		refresh_token: outcome.refreshToken,
		token_type: 'Bearer',
		expires_in: outcome.expiresIn,
		scope: supportedScope
	});
}
