import { error, json } from '@sveltejs/kit';
import { askLibrarian } from '$lib/server/brain/askLibrarian';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { recordBrainEvent } from '$lib/server/brain/recordBrainEvent';
import { spendForBrainQuestion } from '$lib/server/brain/spendForBrainWork';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to ask your Second Brain');

	const question = await readQuestion(request);
	const spend = await spendForBrainQuestion(locals.supabase);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	const index = await getBrainPageIndex(locals.supabase);
	const answer = await askLibrarian(locals.supabase, index, question);
	await recordBrainEvent(locals.supabase, {
		kind: 'question_answered',
		detail: { question, answerMarkdown: answer.answerMarkdown, citedSlugs: answer.citedSlugs }
	});
	return json({ ...answer, creditBalance: spend.creditBalance });
};

async function readQuestion(request: Request): Promise<string> {
	const payload = await request.json();
	const question = typeof payload.question === 'string' ? payload.question.trim() : '';
	if (question === '') error(400, 'A question is required');
	return question;
}
