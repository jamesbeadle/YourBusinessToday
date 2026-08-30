import { error, json } from '@sveltejs/kit';
import { askHiveMind } from '$lib/server/hive/askHiveMind';
import { getHiveMembers } from '$lib/server/hive/getHiveMembers';
import { getHiveModelIndex } from '$lib/server/hive/getHiveModelIndex';
import { recordHiveMindQuestion } from '$lib/server/hive/recordHiveMindQuestion';
import {
	refundForHiveMindQuestion,
	spendForHiveMindQuestion
} from '$lib/server/hive/spendForHiveMindQuestion';
import { spendCredits } from '$lib/server/credits/spendCredits';
import { splitHiveMindEarnings } from '$lib/server/hive/splitHiveMindEarnings';
import { tradeTalkDepthCreditsFor } from '$lib/data/creditPricing';
import type { HiveContributor, HiveMember } from '$lib/data/hiveTypes';
import type { HiveEarningsShare } from '$lib/server/hive/splitHiveMindEarnings';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to ask the Hive Mind');

	const payload = await request.json();
	const question = readQuestion(payload);
	const members = await getHiveMembers(locals.supabase);
	if (members.length === 0) error(409, 'The hive has no specialists yet');
	const spend = await spendForHiveMindQuestion(locals.supabase);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	try {
		const specialists = await getHiveModelIndex(locals.supabase, members);
		const consultation = await askHiveMind(locals.supabase, specialists, question);
		const shares = splitHiveMindEarnings(consultation.pagesReadCounts);
		const depthBalance = await chargeForDepth(locals, consultation.pagesReadCounts);
		await recordHiveMindQuestion(
			locals.supabase,
			question,
			consultation.answerMarkdown,
			consultation.citedPageKeys,
			shares
		);
		return json({
			answerMarkdown: consultation.answerMarkdown,
			contributors: contributorsFrom(members, shares),
			creditBalance: depthBalance ?? spend.creditBalance
		});
	} catch (failure) {
		console.error('Hive Mind question failed', failure);
		await refundForHiveMindQuestion(locals.supabase);
		error(502, 'That question failed — your credits have been refunded');
	}
};

async function chargeForDepth(
	locals: App.Locals,
	pagesReadCounts: Map<string, number>
): Promise<number | null> {
	const totalPagesRead = [...pagesReadCounts.values()].reduce((total, count) => total + count, 0);
	const depthCost = tradeTalkDepthCreditsFor(totalPagesRead);
	if (depthCost === 0) return null;
	const depthSpend = await spendCredits(locals.supabase, depthCost, 'trade_talk_depth');
	if (typeof depthSpend === 'string') return null;
	return depthSpend.creditBalance;
}

function readQuestion(payload: { question?: unknown }): string {
	const question = typeof payload.question === 'string' ? payload.question.trim() : '';
	if (question === '') error(400, 'A question is required');
	return question;
}

function contributorsFrom(members: HiveMember[], shares: HiveEarningsShare[]): HiveContributor[] {
	return shares
		.map((share) => ({
			specialtyName: memberName(members, share.memberId),
			pagesRead: share.pagesRead
		}))
		.sort((first, second) => second.pagesRead - first.pagesRead);
}

function memberName(members: HiveMember[], memberId: string): string {
	return members.find((member) => member.id === memberId)?.specialtyName ?? 'A specialist';
}
