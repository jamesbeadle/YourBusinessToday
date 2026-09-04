import { getRequestComments } from '$lib/server/requests/getRequestComments';
import { getRequestForContact } from '$lib/server/requests/getRequestForContact';
import { featureRequestStatusLabels } from '$lib/data/featureRequests';
import { formatBritishDate } from '$lib/data/britishDate';
import type { McpTool } from '../mcpTools';

export const getFeatureRequestTool: McpTool = {
	name: 'get_feature_request',
	title: 'Read one feature request',
	description:
		'Read one of your company feature requests in full: what was asked for, where it ' +
		'stands, the answer we gave, and every message in its thread.',
	inputSchema: {
		type: 'object',
		properties: { requestId: { type: 'string', description: 'The request id or reference' } },
		required: ['requestId'],
		additionalProperties: false
	},
	run: async (caller, argumentValues) => {
		const requestId = String(argumentValues.requestId ?? '');
		const featureRequest = await getRequestForContact(
			caller.supabase,
			requestId,
			caller.contact.clientId
		);
		if (featureRequest === null) return 'No request of yours has that id.';
		const comments = await getRequestComments(caller.supabase, featureRequest.id);
		return [
			`${featureRequest.reference} — ${featureRequest.title}`,
			`Project: ${featureRequest.projectName}`,
			`Standing: ${featureRequest.isDelivered ? 'Delivered' : featureRequestStatusLabels[featureRequest.status]}`,
			`Raised: ${formatBritishDate(featureRequest.createdAt)}`,
			'',
			featureRequest.body,
			answerLine(featureRequest.decisionNote),
			'',
			comments.length === 0 ? 'No replies yet.' : comments.map(describeComment).join('\n')
		]
			.filter((line) => line !== null)
			.join('\n');
	}
};

function answerLine(decisionNote: string): string | null {
	if (decisionNote === '') return null;
	return `\nOur answer: ${decisionNote}`;
}

function describeComment(comment: { createdAt: string; body: string }): string {
	return `${formatBritishDate(comment.createdAt)}: ${comment.body}`;
}
