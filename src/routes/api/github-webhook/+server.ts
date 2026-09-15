import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { handlePushEvent } from '$lib/server/deploys/handlePushEvent';
import { isGithubSignatureValid } from '$lib/server/builder/verifyGithubSignature';
import { markBuildLive } from '$lib/server/builder/markBuildLive';
import { readMergedPullRequest } from '$lib/server/builder/readMergedPullRequest';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { RequestHandler } from './$types';

/** GitHub tells a task its build merged (pull_request) and a project it deployed (push). */
export const POST: RequestHandler = async ({ request }) => {
	if (!env.GITHUB_WEBHOOK_SECRET) error(503, 'github_webhook_not_configured');
	const payload = await request.text();
	const signature = request.headers.get('x-hub-signature-256');
	if (!isGithubSignatureValid(payload, signature, env.GITHUB_WEBHOOK_SECRET)) {
		error(400, 'invalid_signature');
	}
	const eventName = request.headers.get('x-github-event');
	if (eventName === 'pull_request') return json(await mergedPullRequest(JSON.parse(payload)));
	if (eventName === 'push') return json(await pushedDeploy(JSON.parse(payload), request));
	return json({ ignored: true });
};

async function mergedPullRequest(event: unknown): Promise<Record<string, unknown>> {
	const merged = readMergedPullRequest(event);
	if (merged === null) return { ignored: true };
	const outcome = await markBuildLive(supabaseServiceClient(), merged.branchName, merged.url);
	return { outcome };
}

async function pushedDeploy(event: unknown, request: Request): Promise<Record<string, unknown>> {
	const deliveryId = request.headers.get('x-github-delivery') ?? '';
	if (deliveryId === '') return { ignored: true };
	const outcome = await handlePushEvent(supabaseServiceClient(), event, deliveryId);
	return { outcome };
}
