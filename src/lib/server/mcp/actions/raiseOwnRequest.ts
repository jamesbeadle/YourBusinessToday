import { countRequestsRaisedToday, dailyRequestCeiling, longestRequestBody } from '../requestLimits';
import { notAContact } from './describeContactRequests';
import { raiseFeatureRequest, type RaiseResult } from '$lib/server/requests/raiseFeatureRequest';
import { readText } from '../actionTypes';
import type { McpCaller } from '../resolveMcpCaller';

export async function raiseOwnRequest(
	caller: McpCaller,
	input: Record<string, unknown>
): Promise<string> {
	if (caller.contact === null) return notAContact;
	const title = readText(input, 'title');
	const want = readText(input, 'want');
	if (title === '' || want === '') return 'Say what you want in a sentence, then in your own words.';
	if (want.length > longestRequestBody) {
		return `That is too long — keep it under ${longestRequestBody} characters and link to the detail instead.`;
	}
	const raisedToday = await countRequestsRaisedToday(caller.supabase, caller.contact.id);
	if (raisedToday >= dailyRequestCeiling) {
		return `You have raised ${raisedToday} requests today, which is our daily limit. Add to an existing request instead, or try again tomorrow.`;
	}
	const seed = {
		projectId: readText(input, 'projectId'),
		title,
		want,
		benefit: readText(input, 'benefit')
	};
	return describeRaiseOutcome(await raiseFeatureRequest(caller.supabase, caller.contact, seed));
}

function describeRaiseOutcome(result: RaiseResult): string {
	if (result.outcome === 'not_your_project') {
		return 'That project is not one of yours. Call list_my_projects for the ones you can raise against.';
	}
	if (result.outcome === 'already_open') {
		return `You already have an open request saying much the same thing: ${result.reference}. Add to that one with comment_on_feature_request.`;
	}
	return `Raised as ${result.reference}. Someone will triage it and answer in its thread.`;
}
