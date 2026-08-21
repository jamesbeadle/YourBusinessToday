import { error, json } from '@sveltejs/kit';
import { findBrainSource } from '$lib/server/brain/findBrainSource';
import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { getDomainBrain } from '$lib/server/entities/getDomainBrain';
import { refundForBrainIngest, spendForBrainIngest } from '$lib/server/brain/spendForBrainWork';
import { runSourceIngest } from '$lib/server/brain/runSourceIngest';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

export const POST: RequestHandler = async ({ locals, params }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to manage your domain brain');

	const source = await findBrainSource(locals.supabase, params.sourceId);
	if (source === null) error(404, 'That document could not be found');
	if (source.status !== 'ingested') error(409, 'Only documents already in the brain can be re-read');

	const brain = await getDomainBrain(locals.supabase, source.brainId);
	if (brain === null) error(404, 'That domain brain no longer exists');
	if (brain.ownerId !== user.id) error(403, 'Only the owner can re-read a document');

	const spend = await spendForBrainIngest(locals.supabase, source.id);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		await runSourceIngest(locals.supabase, source);
	} catch (failure) {
		console.error('Brain re-read failed', failure);
		await refundForBrainIngest(locals.supabase);
		error(502, 'Re-reading that document failed — your credits have been refunded');
	}
	return json({ creditBalance: await getCreditBalance(locals.supabase) });
};
