import { error, json } from '@sveltejs/kit';
import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { getDomainBrain } from '$lib/server/entities/getDomainBrain';
import { refundForBrainPrune, spendForBrainPrune } from '$lib/server/brain/spendForBrainWork';
import { runModelPrune } from '$lib/server/brain/runModelPrune';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to manage your domain brain');

	const payload = await request.json();
	const brain = await getDomainBrain(locals.supabase, readBrainId(payload));
	if (brain === null) error(404, 'That domain brain could not be found');
	if (brain.ownerId !== user.id) error(403, 'Only the owner can prune the model');

	const spend = await spendForBrainPrune(locals.supabase);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		const outcome = await runModelPrune(locals.supabase, brain.id);
		return json({ ...outcome, creditBalance: await getCreditBalance(locals.supabase) });
	} catch (failure) {
		console.error('Brain prune failed', failure);
		await refundForBrainPrune(locals.supabase);
		error(502, 'Pruning the model failed — your credits have been refunded');
	}
};

function readBrainId(payload: unknown): string {
	const brainId = (payload as { brainId?: unknown }).brainId;
	if (typeof brainId !== 'string' || brainId === '') error(400, 'Say which brain to prune');
	return brainId;
}
