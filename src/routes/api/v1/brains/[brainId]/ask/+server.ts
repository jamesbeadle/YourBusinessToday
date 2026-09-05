import { error, json } from '@sveltejs/kit';
import { askModeller } from '$lib/server/brain/askModeller';
import { createBrainConversation } from '$lib/server/brain/createBrainConversation';
import { getBrainContexts } from '$lib/server/brain/getBrainContexts';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { getConversationMessages } from '$lib/server/brain/getBrainConversation';
import { recordBrainEvent } from '$lib/server/brain/recordBrainEvent';
import { recordConversationTurn } from '$lib/server/brain/recordConversationTurn';
import { refundForApiQuestion, spendForApiQuestion } from '$lib/server/brainApi/spendForApiQuestion';
import { resolveApiCaller } from '$lib/server/brainApi/resolveApiCaller';
import { cheapestModelId } from '$lib/data/modelLadder';
import type { BrainConversationTurn } from '$lib/data/brainTypes';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

const longestRememberedExchange = 12;

export const config = { maxDuration: 300 };

export const POST: RequestHandler = async ({ request, params }) => {
	const { supabase, brain, tokenHash } = await resolveApiCaller(request, params.brainId);

	const payload = await request.json().catch(() => ({}));
	const question = readQuestion(payload);
	const spend = await spendForApiQuestion(supabase, tokenHash);
	if (spend === 'insufficient_credits') error(402, 'The brain owner is out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		const conversationId = await resolveConversationId(
			supabase,
			brain,
			payload.conversationId
		);
		const priorTurns = await rememberedTurns(supabase, conversationId);
		const contexts = await getBrainContexts(supabase, brain.id);
		const index = await getBrainPageIndex(supabase, brain.id);
		// Fixed 10-credit price, so the API runs on the cheapest rung until it
		// is metered like session questions (docs/model-pricing.md).
		const answer = await askModeller(
			supabase,
			brain.id,
			contexts,
			index,
			[...priorTurns, { speaker: 'user', text: question }],
			cheapestModelId
		);
		await recordConversationTurn(supabase, conversationId, question, answer, brain.ownerId);
		await recordBrainEvent(supabase, {
			brainId: brain.id,
			kind: 'question_answered',
			detail: {
				question,
				answerMarkdown: answer.answerMarkdown,
				citedSlugs: answer.citedSlugs,
				conversationId,
				askedThrough: 'api'
			}
		});
		return json({ conversationId, ...answer, creditBalance: spend.creditBalance });
	} catch (failure) {
		console.error('Brain API question failed', failure);
		await refundForApiQuestion(brain.ownerId);
		error(502, 'That question failed — the credits have been refunded');
	}
};

function readQuestion(payload: { question?: unknown }): string {
	const question = typeof payload.question === 'string' ? payload.question.trim() : '';
	if (question === '') error(400, 'A question is required');
	return question;
}

async function resolveConversationId(
	supabase: SupabaseClient,
	brain: { id: string; ownerId: string },
	candidate: unknown
): Promise<string> {
	if (typeof candidate === 'string' && candidate !== '') {
		const { data } = await supabase
			.from('brain_conversations')
			.select('id')
			.eq('id', candidate)
			.eq('brain_id', brain.id)
			.maybeSingle();
		if (data !== null) return data.id;
	}
	return createBrainConversation(supabase, brain.id, 'api', brain.ownerId);
}

async function rememberedTurns(
	supabase: SupabaseClient,
	conversationId: string
): Promise<BrainConversationTurn[]> {
	const messages = await getConversationMessages(supabase, conversationId);
	return messages
		.slice(-longestRememberedExchange)
		.map((message) => ({ speaker: message.speaker, text: message.body }));
}
