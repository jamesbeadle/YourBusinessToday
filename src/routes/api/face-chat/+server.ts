import { error, json } from '@sveltejs/kit';
import { converseWithFace } from '$lib/server/brain/converseWithFace';
import { createBrainConversation } from '$lib/server/brain/createBrainConversation';
import { getBrainContexts } from '$lib/server/brain/getBrainContexts';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { getLatestConversationId } from '$lib/server/brain/getBrainConversation';
import { getLatestDomainBrain } from '$lib/server/entities/getDomainBrain';
import { recordBrainEvent } from '$lib/server/brain/recordBrainEvent';
import { recordConversationTurn } from '$lib/server/brain/recordConversationTurn';
import { spendForBrainQuestion } from '$lib/server/brain/spendForBrainWork';
import type { FaceChatTurn } from '$lib/data/faceChatTypes';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

const longestConversation = 12;
const longestTurnLength = 2000;

export const config = { maxDuration: 300 };

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to talk to your expertise brain');

	const turns = await readTurns(request);
	const brain = await getLatestDomainBrain(locals.supabase);
	if (brain === null) error(404, 'Create a expertise brain in your workspace first');
	const spend = await spendForBrainQuestion(locals.supabase);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	const contexts = await getBrainContexts(locals.supabase, brain.id);
	const index = await getBrainPageIndex(locals.supabase, brain.id);
	const spoken = await converseWithFace(locals.supabase, brain.id, contexts, index, turns);
	const question = turns[turns.length - 1].text;
	const conversationId = await faceConversationId(locals.supabase, brain.id);
	await recordConversationTurn(locals.supabase, conversationId, question, {
		answerMarkdown: spoken.reply,
		citedSlugs: spoken.citedSlugs
	});
	await recordBrainEvent(locals.supabase, {
		brainId: brain.id,
		kind: 'question_answered',
		detail: {
			question,
			answerMarkdown: spoken.reply,
			citedSlugs: spoken.citedSlugs,
			conversationId,
			askedThrough: 'face'
		}
	});
	return json({ ...spoken, creditBalance: spend.creditBalance });
};

async function faceConversationId(supabase: SupabaseClient, brainId: string): Promise<string> {
	const existingId = await getLatestConversationId(supabase, brainId, 'face');
	return existingId ?? createBrainConversation(supabase, brainId, 'face');
}

async function readTurns(request: Request): Promise<FaceChatTurn[]> {
	const payload = await request.json();
	const turns = Array.isArray(payload.turns) ? payload.turns.map(asTurn) : [];
	if (turns.length === 0) error(400, 'A conversation with at least one message is required');
	if (turns[turns.length - 1].speaker !== 'user') error(400, 'The last message must be yours');
	return turns.slice(-longestConversation);
}

function asTurn(candidate: unknown): FaceChatTurn {
	const turn = candidate as { speaker?: unknown; text?: unknown };
	const speaker = turn.speaker === 'face' ? 'face' : 'user';
	const text = typeof turn.text === 'string' ? turn.text.trim() : '';
	if (text === '') error(400, 'Every message needs some text');
	return { speaker, text: text.slice(0, longestTurnLength) };
}
