import { commentOnFeatureRequest } from '$lib/server/requests/commentOnFeatureRequest';
import { decideFeatureRequest } from '$lib/server/requests/decideFeatureRequest';
import { describeRequestForStaff, noSuchRequest } from './describeTriageQueue';
import { getClientContact } from '$lib/server/clients/getClientContacts';
import { getFeatureRequest, type RequestDetail } from '$lib/server/requests/getFeatureRequest';
import { getRequestComments } from '$lib/server/requests/getRequestComments';
import { getTriageQueue } from '$lib/server/requests/getTriageQueue';
import { isUuid } from '$lib/data/isUuid';
import { promoteFeatureRequestToTask } from '$lib/server/requests/promoteFeatureRequestToTask';
import { readText } from '../actionTypes';
import type { McpCaller } from '../resolveMcpCaller';

export async function readRequestForStaff(
	caller: McpCaller,
	input: Record<string, unknown>
): Promise<string> {
	const featureRequest = await findRequest(caller, readText(input, 'requestId'));
	if (featureRequest === null) return noSuchRequest;
	const comments = await getRequestComments(caller.supabase, featureRequest.id);
	return describeRequestForStaff(featureRequest, comments);
}

export async function replyToRequest(
	caller: McpCaller,
	input: Record<string, unknown>
): Promise<string> {
	const body = readText(input, 'body');
	if (body === '') return 'Write the reply first.';
	const featureRequest = await findRequest(caller, readText(input, 'requestId'));
	if (featureRequest === null) return noSuchRequest;
	await commentOnFeatureRequest(caller.supabase, featureRequest.id, caller.accountId, body);
	return `Posted on ${featureRequest.reference}. ${featureRequest.raisedByName} will read it.`;
}

export async function decideRequest(
	caller: McpCaller,
	input: Record<string, unknown>
): Promise<string> {
	const decision = readText(input, 'decision');
	if (decision !== 'accepted' && decision !== 'declined') {
		return 'Say whether the decision is accepted or declined.';
	}
	const reason = readText(input, 'reason');
	if (reason === '') return 'Give the reason as well. The client is shown it word for word.';
	const featureRequest = await findRequest(caller, readText(input, 'requestId'));
	if (featureRequest === null) return noSuchRequest;
	await decideFeatureRequest(caller.supabase, featureRequest, decision, reason, caller.accountId);
	return `${featureRequest.reference} ${decision}, with your reason on it for ${featureRequest.raisedByName} to read.`;
}

export async function promoteRequestToTask(
	caller: McpCaller,
	input: Record<string, unknown>
): Promise<string> {
	const featureRequest = await findRequest(caller, readText(input, 'requestId'));
	if (featureRequest === null) return noSuchRequest;
	if (featureRequest.taskId !== null) {
		return `${featureRequest.reference} is already a task — task id ${featureRequest.taskId}.`;
	}
	const contact = await getClientContact(caller.supabase, featureRequest.raisedByContactId);
	const contactRole = contact === null ? '' : contact.role;
	const taskId = await promoteFeatureRequestToTask(
		caller.supabase,
		featureRequest,
		contactRole,
		caller.accountId
	);
	return `${featureRequest.reference} is now a task on ${featureRequest.projectName} — task id ${taskId}.`;
}

async function findRequest(caller: McpCaller, requestId: string): Promise<RequestDetail | null> {
	if (isUuid(requestId)) return getFeatureRequest(caller.supabase, requestId);
	const queue = await getTriageQueue(caller.supabase, null);
	const queued = queue.find((request) => request.reference === requestId.toUpperCase());
	if (queued === undefined) return null;
	return getFeatureRequest(caller.supabase, queued.id);
}
