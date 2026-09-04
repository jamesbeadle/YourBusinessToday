import { json } from '@sveltejs/kit';
import { registerOauthClient } from '$lib/server/oauth/registerOauthClient';
import type { RequestHandler } from './$types';

const created = 201;
const badRequest = 400;

export const POST: RequestHandler = async ({ request }) => {
	const submission = await request.json().catch(() => null);
	if (submission === null || typeof submission !== 'object') {
		return json({ error: 'invalid_client_metadata' }, { status: badRequest });
	}
	const registration = await registerOauthClient(submission as Record<string, unknown>);
	if (registration === null) {
		return json(
			{ error: 'invalid_redirect_uri', error_description: 'At least one https redirect URI is required' },
			{ status: badRequest }
		);
	}
	return json(registration, { status: created });
};
