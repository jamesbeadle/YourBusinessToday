import { error } from '@sveltejs/kit';
import { getChatbotsForKnowledgeBase } from '$lib/server/chatbots/getChatbotsForKnowledgeBase';
import { findPrimaryExpertiseBrain } from '$lib/server/knowledge/interviewContext';
import { getKbBrains } from '$lib/server/knowledge/getKbBrains';
import { getKnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
import { getProcessMaps } from '$lib/server/knowledge/getProcessMaps';
import { getKnowledgeBaseShares } from '$lib/server/knowledge/knowledgeBaseShares';
import { loadKbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';
import { requireUser } from '$lib/server/auth/requireUser';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params }) => {
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
