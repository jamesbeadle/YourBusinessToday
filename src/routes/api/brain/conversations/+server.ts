import { error, json } from '@sveltejs/kit';
import { createBrainConversation } from '$lib/server/brain/createBrainConversation';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to talk to your Domain Brain');
	const conversationId = await createBrainConversation(locals.supabase, 'brain');
	return json({ conversationId });
};
