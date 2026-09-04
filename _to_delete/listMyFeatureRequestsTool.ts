import { getRequestsForClient, type ClientRequest } from '$lib/server/requests/getRequestsForClient';
import { featureRequestStatusLabels } from '$lib/data/featureRequests';
import type { McpTool } from '../mcpTools';

export const listMyFeatureRequestsTool: McpTool = {
	name: 'list_my_feature_requests',
	title: 'List your feature requests',
	description:
		'List every feature request your company has raised, newest first, with the ' +
		'reference, the project it is against, and where it stands.',
	inputSchema: { type: 'object', properties: {}, additionalProperties: false },
	run: async (caller) => {
		const requests = await getRequestsForClient(caller.supabase, caller.contact.clientId);
		if (requests.length === 0) return 'Your company has not raised any feature requests yet.';
		return requests.map(describeRequest).join('\n');
	}
};

function describeRequest(featureRequest: ClientRequest): string {
	return `${featureRequest.reference} — ${featureRequest.title} — ${featureRequest.projectName} — ${standingOf(featureRequest)}`;
}

function standingOf(featureRequest: ClientRequest): string {
	if (featureRequest.isDelivered) return 'Delivered';
	return featureRequestStatusLabels[featureRequest.status];
}
