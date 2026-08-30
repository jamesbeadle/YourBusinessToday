import { error, json } from '@sveltejs/kit';
import { askInterviewer, type InterviewTurnInput } from '$lib/server/knowledge/interviewAgent';
import {
	buildInterviewContext,
	findPrimaryExpertiseBrain
} from '$lib/server/knowledge/interviewContext';
import { creditsPerInterviewReply } from '$lib/data/creditPricing';
import { fileHarvestToKnowledgeBase } from '$lib/server/agent/fileHarvestedKnowledge';
import { getKnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
import { spendCredits } from '$lib/server/credits/spendCredits';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

const longestConversation = 16;
const longestTurnLength = 2000;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to be interviewed');

	const { knowledgeBaseId, conversation } = await readInterviewRequest(request);
	const knowledgeBase = await getKnowledgeBase(locals.supabase, knowledgeBaseId);
	if (knowledgeBase === null) error(404, 'That knowledge base could not be found');

	const spend = await spendCredits(locals.supabase, creditsPerInterviewReply, 'kb_interview');
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	const primary = await findPrimaryExpertiseBrain(locals.supabase, knowledgeBase.id);
	const context = await buildInterviewContext(
		locals.supabase,
		knowledgeBase.id,
		knowledgeBase.name,
		primary
	);
	const turn = await askInterviewer(conversation, context);
	await fileHarvestToKnowledgeBase(locals.supabase, knowledgeBase.id, turn.harvest);
	return json({
		reply: turn.reply,
		harvestedCount: turn.harvest.expertiseFacts.length + turn.harvest.experienceEvents.length,
		creditBalance: spend.creditBalance
	});
};

async function readInterviewRequest(
	request: Request
): Promise<{ knowledgeBaseId: string; conversation: InterviewTurnInput[] }> {
	const payload = await request.json();
	const knowledgeBaseId = typeof payload.knowledgeBaseId === 'string' ? payload.knowledgeBaseId : '';
	if (knowledgeBaseId === '') error(400, 'A knowledge base is required');
	return { knowledgeBaseId, conversation: parseConversation(payload.conversation) };
}

function parseConversation(value: unknown): InterviewTurnInput[] {
	if (!Array.isArray(value)) return [];
	return value
		.flatMap((turn) => {
			if (typeof turn !== 'object' || turn === null) return [];
			const record = turn as Record<string, unknown>;
			const author = record.author === 'agent' ? 'agent' : 'user';
			const text = typeof record.text === 'string' ? record.text.slice(0, longestTurnLength) : '';
			return text === '' ? [] : [{ author, text } as InterviewTurnInput];
		})
		.slice(-longestConversation);
}
