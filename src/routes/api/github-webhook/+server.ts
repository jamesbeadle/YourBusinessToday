import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { isGithubSignatureValid } from '$lib/server/builder/verifyGithubSignature';
import { markBuildLive } from '$lib/server/builder/markBuildLive';
import { readMergedPullRequest } from '$lib/server/builder/readMergedPullRequest';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	if (!env.GITHUB_WEBHOOK_SECRET) error(503, 'github_webhook_not_configured');
	const payload = await request.text();
	const signature = request.headers.get('x-hub-signature-256');
	if (!isGithubSignatureValid(payload, signature, env.GITHUB_WEBHOOK_SECRET)) {
		error(400, 'invalid_signature');
	}
	if (request.headers.get('x-github-event') !== 'pull_request') return json({ ignored: true });
	const merged = readMergedPullRequest(JSON.parse(payload));
	if (merged === null) return json({ ignored: true });
	const outcome = await markBuildLive(supabaseServiceClient(), merged.branchName, merged.url);
	return json({ outcome });
};
