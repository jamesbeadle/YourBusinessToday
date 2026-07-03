import { fail } from '@sveltejs/kit';
import { addMapViewer } from '$lib/server/maps/addMapViewer';
import { getConversationHistory } from '$lib/server/agent/getConversationHistory';
import { getLatestWorkflowMap } from '$lib/server/maps/getLatestWorkflowMap';
import { getMapViewers } from '$lib/server/maps/getMapViewers';
import { removeMapViewer } from '$lib/server/maps/removeMapViewer';
import { requireUser } from '$lib/server/auth/requireUser';
import type { ChatMessage } from '$lib/data/chatTypes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	const conversationHistory = await getConversationHistory(locals.supabase);
	const messages: ChatMessage[] = conversationHistory.map((turn, turnIndex) => ({
		id: turnIndex,
		author: turn.author,
		text: turn.body
	}));
	return {
		messages,
		latestMap: await getLatestWorkflowMap(locals.supabase),
		viewers: await getMapViewers(locals.supabase)
	};
};

export const actions: Actions = {
	addViewer: async ({ locals, request }) => {
		const user = await requireUser(locals);
		const formData = await request.formData();
		const viewerEmail = String(formData.get('viewerEmail') ?? '').trim();
		if (viewerEmail === '') return fail(400, { message: 'An email address is required.' });
		await addMapViewer(locals.supabase, user.id, viewerEmail);
		return { sharedWith: viewerEmail };
	},
	removeViewer: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const viewerId = Number(formData.get('viewerId'));
		if (!Number.isInteger(viewerId)) return fail(400, { message: 'Unknown viewer.' });
		await removeMapViewer(locals.supabase, viewerId);
		return {};
	}
};
