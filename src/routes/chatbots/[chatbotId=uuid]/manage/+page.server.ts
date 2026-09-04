import { fail, redirect } from '@sveltejs/kit';
import { answerQuestion, dismissQuestion } from './knowledgeGapActions';
import { deleteChatbot } from '$lib/server/chatbots/deleteChatbot';
import { getChatbotKnowledgeGaps } from '$lib/server/chatbots/getChatbotKnowledgeGaps';
import { getChatbotMembers } from '$lib/server/chatbots/getChatbotMembers';
import { getChatbotTopUps } from '$lib/server/chatbots/getChatbotTopUps';
import { inviteChatbotMember } from '$lib/server/chatbots/inviteChatbotMember';
import { removeChatbotMember } from '$lib/server/chatbots/removeChatbotMember';
import { topUpChatbot } from '$lib/server/chatbots/topUpChatbot';
import { updateChatbot } from '$lib/server/chatbots/updateChatbot';
import { parseAllowances, parseCredits } from '$lib/server/chatbots/parseTopUpForm';
import { isLadderModel } from '$lib/data/modelLadder';
import { requireOwnedChatbot } from '$lib/server/chatbots/requireOwnedChatbot';
import { requireUser } from '$lib/server/auth/requireUser';
import { setMemberModel } from '$lib/server/chatbots/setMemberModel';
import { teachingNoteCredits } from '$lib/server/chatbots/teachChatbotAnswer';
import type { Actions, PageServerLoad } from './$types';

// Answering a question reads it into the brain with Claude, which outlives
// Vercel's default function limit.
export const config = { maxDuration: 300 };

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = await requireUser(locals);
	const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
	return {
		chatbot,
		members: await getChatbotMembers(locals.supabase, chatbot.id),
		topUps: await getChatbotTopUps(locals.supabase, chatbot.id),
		knowledgeGaps: await getChatbotKnowledgeGaps(locals.supabase, chatbot.id),
		teachingCredits: teachingNoteCredits
	};
};

export const actions: Actions = {
	answerQuestion,
	dismissQuestion,
	rename: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'The chatbot needs a name.' });
		await updateChatbot(locals.supabase, chatbot.id, { name });
	},
	setPaused: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		const isPaused = String(formData.get('isPaused')) === 'true';
		await updateChatbot(locals.supabase, chatbot.id, { isPaused });
	},
	setModel: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		const modelId = String(formData.get('modelId') ?? '');
		if (!isLadderModel(modelId)) return fail(400, { message: 'Pick a model from the slider.' });
		await updateChatbot(locals.supabase, chatbot.id, { modelId });
	},
	setMemberModel: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		const modelId = String(formData.get('modelId') ?? '');
		if (modelId !== '' && !isLadderModel(modelId)) {
			return fail(400, { message: 'That is not a model on the ladder.' });
		}
		await setMemberModel(
			locals.supabase,
			String(formData.get('memberId') ?? ''),
			modelId === '' ? null : modelId
		);
	},
	deleteChatbot: async ({ locals, params }) => {
		const user = await requireUser(locals);
		const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		await deleteChatbot(locals.supabase, chatbot.id);
		redirect(303, `/knowledge-base/${chatbot.knowledgeBaseId}`);
	},
	inviteMember: async ({ locals, params, request, url }) => {
		const user = await requireUser(locals);
		const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		const invitedEmail = String(formData.get('email') ?? '').trim();
		if (invitedEmail === '') return fail(400, { message: 'Enter an email address to invite.' });
		if (invitedEmail.toLowerCase() === (user.email ?? '').toLowerCase()) {
			return fail(400, { message: "That's your own address — invite someone else." });
		}
		const outcome = await inviteChatbotMember(
			locals.supabase,
			chatbot,
			invitedEmail,
			user.email ?? '',
			url.origin
		);
		if (outcome === 'already_invited') {
			return fail(400, { message: 'That address is already a member.' });
		}
	},
	removeMember: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		await removeChatbotMember(locals.supabase, String(formData.get('memberId') ?? ''));
	},
	topUp: async ({ locals, params, request }) => {
		const user = await requireUser(locals);
		const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
		const formData = await request.formData();
		const credits = parseCredits(formData);
		if (credits === null) return fail(400, { message: 'Enter how many credits to add.' });
		const outcome = await topUpChatbot(
			locals.supabase,
			chatbot.id,
			credits,
			parseAllowances(formData)
		);
		if (outcome === 'insufficient_credits') {
			return fail(402, { message: "You don't have that many credits to give." });
		}
		if (outcome === 'account_restricted') {
			return fail(403, { message: 'Your account is currently restricted.' });
		}
	}
};
