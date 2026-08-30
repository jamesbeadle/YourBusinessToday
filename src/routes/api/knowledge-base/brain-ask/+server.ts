import { error, json } from '@sveltejs/kit';
import { answerBrainQuestion } from '$lib/server/knowledge/brainQuery';
import { creditsPerBrainQuestion } from '$lib/data/creditPricing';
import { getBrainItems } from '$lib/server/knowledge/getBrainItems';
import { getKbBrain } from '$lib/server/knowledge/getKbBrain';
import { spendCredits } from '$lib/server/credits/spendCredits';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 120 };

const longestQuestion = 1000;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to query a brain');

	const { brainId, question } = await readQuestionRequest(request);
	const brain = await getKbBrain(locals.supabase, brainId);
	if (brain === null) error(404, 'That brain could not be found');

	const spend = await spendCredits(locals.supabase, creditsPerBrainQuestion, 'brain_question');
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	const items = await getBrainItems(locals.supabase, brain.id);
	const reply = await answerBrainQuestion(brain, items, question);
	return json({ reply, creditBalance: spend.creditBalance });
};

async function readQuestionRequest(
	request: Request
): Promise<{ brainId: string; question: string }> {
	const payload = await request.json();
	const brainId = typeof payload.brainId === 'string' ? payload.brainId : '';
	const question =
		typeof payload.question === 'string' ? payload.question.trim().slice(0, longestQuestion) : '';
	if (brainId === '' || question === '') error(400, 'A brain and a question are required');
	return { brainId, question };
}
