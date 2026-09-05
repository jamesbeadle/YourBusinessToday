import { describeTriageQueue } from './describeTriageQueue';
import { featureRequestStatusOrder, type FeatureRequestStatus } from '$lib/data/featureRequests';
import { getTriageQueue } from '$lib/server/requests/getTriageQueue';
import { objectSchema, readOptionalText, textField } from '../actionTypes';
import {
	decideRequest,
	promoteRequestToTask,
	readRequestForStaff,
	replyToRequest
} from './triageFeatureRequest';
import type { McpAction } from '../actionTypes';

const requestIdField = textField('The request id, or its reference such as FR-0007');

export const staffRequestActions: McpAction[] = [
	{
		name: 'list_triage_queue',
		area: 'requests',
		audience: 'staff',
		isWrite: false,
		summary: 'every feature request clients have raised, newest first, narrowed by status if you ask',
		inputSchema: objectSchema({
			status: textField(`Show only these: ${featureRequestStatusOrder.join(', ')}`)
		}),
		run: async (caller, input) =>
			describeTriageQueue(await getTriageQueue(caller.supabase, readStatus(input)))
	},
	{
		name: 'read_feature_request',
		area: 'requests',
		audience: 'staff',
		isWrite: false,
		summary: 'one request in full: who asked, what for, where it stands and every message on it',
		inputSchema: objectSchema({ requestId: requestIdField }, ['requestId']),
		run: async (caller, input) => readRequestForStaff(caller, input)
	},
	{
		name: 'reply_to_feature_request',
		area: 'requests',
		audience: 'staff',
		isWrite: true,
		summary: 'add a message to the thread on a request, where the client will read it',
		guidance:
			'The client reads every word of this thread, so write to them rather than about them. ' +
			'Say what happens next and when, and answer here rather than only by email.',
		inputSchema: objectSchema(
			{ requestId: requestIdField, body: textField('What you want to say to them') },
			['requestId', 'body']
		),
		run: async (caller, input) => replyToRequest(caller, input)
	},
	{
		name: 'decide_feature_request',
		area: 'requests',
		audience: 'staff',
		isWrite: true,
		summary: 'accept or decline a request and give the client the reason',
		guidance:
			'The reason is shown to the client as our answer, so it is required either way. ' +
			'Declining without one is not acceptable: say what stopped us and what they can do instead.',
		inputSchema: objectSchema(
			{
				requestId: requestIdField,
				decision: textField('accepted or declined'),
				reason: textField('Why, in words the client will read')
			},
			['requestId', 'decision', 'reason']
		),
		run: async (caller, input) => decideRequest(caller, input)
	},
	{
		name: 'promote_request_to_task',
		area: 'requests',
		audience: 'staff',
		isWrite: true,
		summary: 'turn an accepted request into a task on its project, carrying the user story over',
		guidance:
			'Decide the request before promoting it, so the answer the client reads and the work we ' +
			'do say the same thing. A request can only become a task once.',
		inputSchema: objectSchema({ requestId: requestIdField }, ['requestId']),
		run: async (caller, input) => promoteRequestToTask(caller, input)
	}
];

function readStatus(input: Record<string, unknown>): FeatureRequestStatus | null {
	const requested = readOptionalText(input, 'status');
	return featureRequestStatusOrder.find((candidate) => candidate === requested) ?? null;
}
