import { error, json } from '@sveltejs/kit';
import { findBrainSource, markSourceStatus } from '$lib/server/brain/findBrainSource';
import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { refundForBrainIngest, spendForBrainIngest } from '$lib/server/brain/spendForBrainWork';
import { runSourceIngest } from '$lib/server/brain/runSourceIngest';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

const failureSummaryLimit = 160;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to build your Domain Brain');

	const sourceId = await readSourceId(request);
	const source = await findBrainSource(locals.supabase, sourceId);
	if (source === null) error(404, 'That document could not be found');
	if (source.status === 'ingested') error(409, 'That document is already in the brain');

	const spend = await spendForBrainIngest(locals.supabase, sourceId);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		await runSourceIngest(locals.supabase, source);
	} catch (failure) {
		console.error('Brain ingest failed', failure);
		await markSourceStatus(locals.supabase, sourceId, 'failed', failureSummary(failure));
		await refundForBrainIngest(locals.supabase);
		error(502, 'Reading that document failed — your credits have been refunded');
	}
	return json({ creditBalance: await getCreditBalance(locals.supabase) });
};

function failureSummary(failure: unknown): string {
	const message = failure instanceof Error ? failure.message : 'Unknown failure';
	return message.slice(0, failureSummaryLimit);
}

async function readSourceId(request: Request): Promise<string> {
	const payload = await request.json();
	const sourceId = typeof payload.sourceId === 'string' ? payload.sourceId : '';
	if (sourceId === '') error(400, 'A source is required');
	return sourceId;
}
