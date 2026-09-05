import {
	describeOwnProjects,
	describeOwnRequestInFull,
	describeOwnRequests,
	noSuchOwnRequest,
	notAContact
} from './describeContactRequests';
import { getClientProjects } from '$lib/server/clients/getClientProjects';
import { getRequestComments } from '$lib/server/requests/getRequestComments';
import { getRequestForContact } from '$lib/server/requests/getRequestForContact';
import { getRequestsForClient } from '$lib/server/requests/getRequestsForClient';
import { objectSchema, readText, textField } from '../actionTypes';
import { raiseOwnRequest } from './raiseOwnRequest';
import { replyToOwnRequest } from './replyToOwnRequest';
import type { McpAction } from '../actionTypes';

const requestIdField = textField('The request id, or its reference such as FR-0007');

export const contactRequestActions: McpAction[] = [
	{
		name: 'list_my_projects',
		area: 'projects',
		audience: 'contact',
		isWrite: false,
		summary: 'the projects we build and run for your company, with the ids requests are raised against',
		inputSchema: objectSchema({}),
		run: async (caller) => {
			if (caller.contact === null) return notAContact;
			return describeOwnProjects(await getClientProjects(caller.supabase, caller.contact.clientId));
		}
	},
	{
		name: 'list_my_feature_requests',
		area: 'requests',
		audience: 'contact',
		isWrite: false,
		summary: 'every feature request your company has raised, newest first, and where each stands',
		inputSchema: objectSchema({}),
		run: async (caller) => {
			if (caller.contact === null) return notAContact;
			return describeOwnRequests(await getRequestsForClient(caller.supabase, caller.contact.clientId));
		}
	},
	{
		name: 'get_feature_request',
		area: 'requests',
		audience: 'contact',
		isWrite: false,
		summary: 'one of your requests in full: what you asked for, our answer, and the whole thread',
		inputSchema: objectSchema({ requestId: requestIdField }, ['requestId']),
		run: async (caller, input) => {
			if (caller.contact === null) return notAContact;
			const clientId = caller.contact.clientId;
			const requestId = readText(input, 'requestId');
			const featureRequest = await getRequestForContact(caller.supabase, requestId, clientId);
			if (featureRequest === null) return noSuchOwnRequest;
			const comments = await getRequestComments(caller.supabase, featureRequest.id);
			return describeOwnRequestInFull(featureRequest, comments);
		}
	},
	{
		name: 'raise_feature_request',
		area: 'requests',
		audience: 'contact',
		isWrite: true,
		summary: 'ask for something new on one of your projects',
		guidance:
			'A person reads every one of these, so say what you want in plain words and why it ' +
			'matters. One ask per request, and add to an open request rather than raising it twice.',
		inputSchema: objectSchema(
			{
				projectId: textField('The project id, as given by list_my_projects'),
				title: textField('The ask in one sentence'),
				want: textField('What you want, in your own words'),
				benefit: textField('So that — why it matters')
			},
			['projectId', 'title', 'want']
		),
		run: async (caller, input) => raiseOwnRequest(caller, input)
	},
	{
		name: 'comment_on_feature_request',
		area: 'requests',
		audience: 'contact',
		isWrite: true,
		summary: 'add a message to the thread on one of your requests',
		inputSchema: objectSchema(
			{ requestId: requestIdField, body: textField('What you want to say') },
			['requestId', 'body']
		),
		run: async (caller, input) => replyToOwnRequest(caller, input)
	}
];
