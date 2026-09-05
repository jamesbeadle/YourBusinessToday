import { commentOnFeatureRequest } from '$lib/server/requests/commentOnFeatureRequest';
import { getRequestForContact } from '$lib/server/requests/getRequestForContact';
import { longestRequestBody } from '../requestLimits';
import { noSuchOwnRequest, notAContact } from './describeContactRequests';
import { readText } from '../actionTypes';
import type { McpCaller } from '../resolveMcpCaller';

export async function replyToOwnRequest(
	caller: McpCaller,
	input: Record<string, unknown>
): Promise<string> {
	if (caller.contact === null) return notAContact;
	if (caller.contact.accountId === null) return 'Your account is not linked yet, so you cannot post.';
	const body = readText(input, 'body');
	if (body === '') return 'Write something first.';
	if (body.length > longestRequestBody) {
		return `That is too long — keep it under ${longestRequestBody} characters.`;
	}
	const featureRequest = await getRequestForContact(
		caller.supabase,
		readText(input, 'requestId'),
		caller.contact.clientId
	);
	if (featureRequest === null) return noSuchOwnRequest;
	await commentOnFeatureRequest(
		caller.supabase,
		featureRequest.id,
		caller.contact.accountId,
		body
	);
	return `Posted on ${featureRequest.reference}.`;
}
