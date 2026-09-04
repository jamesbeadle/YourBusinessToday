import { commentOnFeatureRequest } from '$lib/server/requests/commentOnFeatureRequest';
import { getRequestForContact } from '$lib/server/requests/getRequestForContact';
import { longestRequestBody } from '../requestLimits';
import type { McpTool } from '../mcpTools';

export const commentOnFeatureRequestTool: McpTool = {
	name: 'comment_on_feature_request',
	title: 'Reply on a feature request',
	description:
		'Add a message to the thread on one of your company feature requests. Everyone at ' +
		'Your Business Today working on it will see it.',
	inputSchema: {
		type: 'object',
		properties: {
			requestId: { type: 'string', description: 'The request id or reference' },
			body: { type: 'string', description: 'What you want to say' }
		},
		required: ['requestId', 'body'],
		additionalProperties: false
	},
	run: async (caller, argumentValues) => {
		if (caller.contact.accountId === null) return 'Your account is not linked yet, so you cannot post.';
		const body = String(argumentValues.body ?? '').trim();
		if (body === '') return 'Write something first.';
		if (body.length > longestRequestBody) {
			return `That is too long — keep it under ${longestRequestBody} characters.`;
		}
		const featureRequest = await getRequestForContact(
			caller.supabase,
			String(argumentValues.requestId ?? ''),
			caller.contact.clientId
		);
		if (featureRequest === null) return 'No request of yours has that id.';
		await commentOnFeatureRequest(
			caller.supabase,
			featureRequest.id,
			caller.contact.accountId,
			body
		);
		return `Posted on ${featureRequest.reference}.`;
	}
};
