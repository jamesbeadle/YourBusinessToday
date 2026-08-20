import { error, json } from '@sveltejs/kit';
import { askModeller } from '$lib/server/brain/askModeller';
import { createBrainConversation } from '$lib/server/brain/createBrainConversation';
import { getBrainContexts } from '$lib/server/brain/getBrainContexts';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { getConversationMessages } from '$lib/server/brain/getBrainConversation';
import { getDomainBrain } from '$lib/server/entities/getDomainBrain';
import { recordBrainEvent } from '$lib/server/brain/recordBrainEvent';
import { recordConversationTurn } from '$lib/server/brain/recordConversationTurn';
import { spendForBrainQuestion } from '$lib/server/brain/spendForBrainWork';
import type { BrainConversationTurn } from '$lib/data/brainTypes';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

const longestRememberedExchange = 12;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to talk to your domain brain');

	const payload = await request.json();
	const question = readQuestion(payload);
	const brain = await getDomainBrain(locals.supabase, readBrainId(payload));
	if (brain === null) error(404, 'That domain brain could not be found');
	const spend = await spendForBrainQuestion(locals.supabase);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	const conversationId = await resolveConversationId(locals.supabase, brain.id, payload.conversationId);
	const priorTurns = await rememberedTurns(locals.supabase, conversationId);
	const contexts = await getBrainContexts(locals.supabase, brain.id);
	const index = await getBrainPageIndex(locals.supabase, brain.id);
	const answer = await askModeller(locals.supabase, brain.id, contexts, index, [
		...priorTurns,
		{ speaker: 'user', text: question }
	]);
	await recordConversationTurn(locals.supabase, conversationId, question, answer);
	await recordBrainEvent(locals.supabase, {
		brainId: brain.id,
		kind: 'question_answered',
		detail: {
			question,
			answerMarkdown: answer.answerMarkdown,
			citedSlugs: answer.citedSlugs,
			conversationId
		}
	});
	return json({ conversationId, ...answer, creditBalance: spend.creditBalance });
};

function readQuestion(payload: { question?: unknown }): string {
	const question = typeof payload.question === 'string' ? payload.question.trim() : '';
	if (question === '') error(400, 'A question is required');
	return question;
}

function readBrainId(payload: { brainId?: unknown }): string {
	const brainId = typeof payload.brainId === 'string' ? payload.brainId : '';
	if (brainId === '') error(400, 'A domain brain is required');
	return brainId;
}

async function resolveConversationId(
	supabase: SupabaseClient,
	brainId: string,
	candidate: unknown
): Promise<string> {
	if (typeof candidate === 'string' && candidate !== '') {
		const { data } = await supabase
			.from('brain_conversations')
			.select('id')
			.eq('id', candidate)
			.eq('brain_id', brainId)
			.maybeSingle();
		if (data !== null) return data.id;
	}
	return createBrainConversation(supabase, brainId, 'brain');
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
