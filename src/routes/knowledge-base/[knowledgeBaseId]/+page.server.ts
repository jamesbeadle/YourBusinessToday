import { error, fail, redirect } from '@sveltejs/kit';
import { createChatbot } from '$lib/server/chatbots/createChatbot';
import { getChatbotsForKnowledgeBase } from '$lib/server/chatbots/getChatbotsForKnowledgeBase';
import { deleteKnowledgeBase } from '$lib/server/knowledge/deleteKnowledgeBase';
import { findPrimaryExpertiseBrain } from '$lib/server/knowledge/interviewContext';
import { getKbBrains } from '$lib/server/knowledge/getKbBrains';
import { getKnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
import { getProcessMaps } from '$lib/server/knowledge/getProcessMaps';
import {
	getKnowledgeBaseShares,
	removeKnowledgeBaseShare,
	shareKnowledgeBase
} from '$lib/server/knowledge/knowledgeBaseShares';
import { loadKbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';
import { updateKnowledgeBase } from '$lib/server/knowledge/updateKnowledgeBase';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = await requireUser(locals);
	const knowledgeBase = await getKnowledgeBase(locals.supabase, params.knowledgeBaseId);
	if (knowledgeBase === null) error(404, 'That knowledge base is not yours to open');
	const isOwner = knowledgeBase.ownerId === user.id;
	const primary = await findPrimaryExpertiseBrain(locals.supabase, knowledgeBase.id);
	return {
		knowledgeBase,
		isOwner,
		brains: await getKbBrains(locals.supabase, knowledgeBase.id),
		processMaps: await getProcessMaps(locals.supabase, knowledgeBase.id),
		shares: isOwner ? await getKnowledgeBaseShares(locals.supabase, knowledgeBase.id) : [],
		chatbots: isOwner ? await getChatbotsForKnowledgeBase(locals.supabase, knowledgeBase.id) : [],
		workbench: await loadKbWorkbenchData(locals.supabase, primary, isOwner)
	};
};

export const actions: Actions = {
	setArchived: async ({ locals, params, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const isArchived = String(formData.get('isArchived')) === 'true';
		await updateKnowledgeBase(locals.supabase, params.knowledgeBaseId, { isArchived });
	},
	deleteKnowledgeBase: async ({ locals, params }) => {
		const user = await requireUser(locals);
		const knowledgeBase = await getKnowledgeBase(locals.supabase, params.knowledgeBaseId);
		if (knowledgeBase === null || knowledgeBase.ownerId !== user.id) {
			return fail(403, { message: 'Only the owner can delete a knowledge base.' });
		}
		await deleteKnowledgeBase(locals.supabase, knowledgeBase.id);
		redirect(303, '/knowledge-base');
	},
	shareKnowledgeBase: async ({ locals, params, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const viewerEmail = String(formData.get('viewerEmail') ?? '').trim();
		if (viewerEmail === '') return fail(400, { message: 'Enter an email address to share with.' });
		const shareProblem = await shareKnowledgeBase(
			locals.supabase,
			params.knowledgeBaseId,
			viewerEmail
		);
		if (shareProblem !== null) return fail(400, { message: shareProblem });
	},
	removeShare: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		await removeKnowledgeBaseShare(locals.supabase, String(formData.get('shareId') ?? ''));
	},
	createChatbot: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		const knowledgeBase = await getKnowledgeBase(locals.supabase, params.knowledgeBaseId);
		if (knowledgeBase === null || knowledgeBase.ownerId !== user.id) {
			return fail(403, { message: 'Only the owner can create a chatbot.' });
		}
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'Give the chatbot a name.' });
		const chatbotId = await createChatbot(locals.supabase, knowledgeBase.id, name);
		redirect(303, `/chatbots/${chatbotId}/manage`);
	}
};
