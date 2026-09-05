import { error, json } from '@sveltejs/kit';
import { askInterviewer, type InterviewTurnInput } from '$lib/server/knowledge/interviewAgent';
import type { InterviewFocus } from '$lib/server/knowledge/interviewPrompt';
import {
	buildInterviewContext,
	findPrimaryExpertiseBrain
} from '$lib/server/knowledge/interviewContext';
import { questionFloorCreditsFor } from '$lib/data/creditPricing';
import { resolveRequestModel } from '$lib/server/anthropic/resolveRequestModel';
import { settleQuestionUsage } from '$lib/server/credits/settleQuestionUsage';
import { fileHarvestToKnowledgeBase } from '$lib/server/agent/fileHarvestedKnowledge';
import { requireOwnedKnowledgeBase } from '$lib/server/knowledge/requireOwnedKnowledgeBase';
import { isAnthropicConfigured } from '$lib/server/anthropic/isAnthropicConfigured';
import { refundCredits, spendCredits } from '$lib/server/credits/spendCredits';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

const longestConversation = 16;
const longestTurnLength = 2000;
const interviewSpendReason = 'kb_interview';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to be interviewed');
	if (!isAnthropicConfigured()) error(503, 'The interviewer is offline right now — try again shortly');

	const { knowledgeBaseId, conversation, focus } = await readInterviewRequest(request);
	const knowledgeBase = await requireOwnedKnowledgeBase(locals.supabase, knowledgeBaseId, user.id);

	const reserve = questionFloorCreditsFor(await resolveRequestModel());
	const spend = await spendCredits(locals.supabase, reserve, interviewSpendReason);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		const turn = await interviewTurn(locals, knowledgeBase, conversation, focus);
		const settledBalance = await settleQuestionUsage(user.id, reserve, interviewSpendReason);
		return json({ ...turn, creditBalance: settledBalance ?? spend.creditBalance });
	} catch (failure) {
		console.error('Interview turn failed', failure);
		await refundCredits(user.id, reserve, interviewSpendReason);
		error(502, 'That turn failed — your credits have been refunded');
	}
};

async function interviewTurn(
	locals: App.Locals,
	knowledgeBase: { id: string; name: string },
	conversation: InterviewTurnInput[],
	focus: InterviewFocus
): Promise<{ reply: string; harvestedCount: number }> {
	const primary = await findPrimaryExpertiseBrain(locals.supabase, knowledgeBase.id);
	const context = await buildInterviewContext(
		locals.supabase,
		knowledgeBase.id,
		knowledgeBase.name,
		primary
	);
	const turn = await askInterviewer(conversation, context, focus);
	await fileHarvestToKnowledgeBase(locals.supabase, knowledgeBase.id, turn.harvest);
	return {
		reply: turn.reply,
		harvestedCount: turn.harvest.expertiseFacts.length + turn.harvest.experienceEvents.length
	};
}

async function readInterviewRequest(request: Request): Promise<{
	knowledgeBaseId: string;
	conversation: InterviewTurnInput[];
	focus: InterviewFocus;
}> {
	const payload = await request.json();
	const knowledgeBaseId = typeof payload.knowledgeBaseId === 'string' ? payload.knowledgeBaseId : '';
	if (knowledgeBaseId === '') error(400, 'A knowledge base is required');
	return {
		knowledgeBaseId,
		conversation: parseConversation(payload.conversation),
		focus: parseFocus(payload.focusKind)
	};
}

function parseFocus(value: unknown): InterviewFocus {
	if (value === 'expertise' || value === 'experience' || value === 'process') return value;
	return null;
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
