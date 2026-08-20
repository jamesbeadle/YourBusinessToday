import { error, json } from '@sveltejs/kit';
import { deleteBrainSource } from '$lib/server/brain/deleteBrainSource';
import { findBrainSource } from '$lib/server/brain/findBrainSource';
import { getCreditBalance } from '$lib/server/credits/getCreditBalance';
import { runSourceRemoval } from '$lib/server/brain/runSourceRemoval';
import {
	refundForBrainUnlearn,
	spendForBrainUnlearn
} from '$lib/server/brain/spendForBrainWork';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to manage your domain brain');

	const source = await findBrainSource(locals.supabase, params.sourceId);
	if (source === null) error(404, 'That document could not be found');

	if (source.status !== 'ingested') {
		await deleteBrainSource(locals.supabase, source);
		return json({ creditBalance: await getCreditBalance(locals.supabase) });
	}

	const spend = await spendForBrainUnlearn(locals.supabase, source.id);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		await runSourceRemoval(locals.supabase, source);
	} catch {
		await refundForBrainUnlearn(locals.supabase);
		error(502, 'Unlearning that document failed — your credits have been refunded');
	}
	return json({ creditBalance: await getCreditBalance(locals.supabase) });
};
