import { countRequestsRaisedToday, dailyRequestCeiling, longestRequestBody } from '../requestLimits';
import { raiseFeatureRequest } from '$lib/server/requests/raiseFeatureRequest';
import type { McpTool } from '../mcpTools';

export const raiseFeatureRequestTool: McpTool = {
	name: 'raise_feature_request',
	title: 'Raise a feature request',
	description:
		'Raise a feature request against a project Your Business Today builds for your ' +
		'company. Call list_my_projects first for the project id. Say what you want in ' +
		'plain words and why it matters — a person reads every one.',
	inputSchema: {
		type: 'object',
		properties: {
			projectId: { type: 'string', description: 'From list_my_projects' },
			title: { type: 'string', description: 'The ask in one sentence' },
			want: { type: 'string', description: 'What you want, in your own words' },
			benefit: { type: 'string', description: 'So that — why it matters' }
		},
		required: ['projectId', 'title', 'want'],
		additionalProperties: false
	},
	run: async (caller, argumentValues) => {
		const want = String(argumentValues.want ?? '').trim();
		if (want.length > longestRequestBody) {
			return `That is too long — keep it under ${longestRequestBody} characters and link to the detail instead.`;
		}
		const raisedToday = await countRequestsRaisedToday(caller.supabase, caller.contact.id);
		if (raisedToday >= dailyRequestCeiling) {
			return `You have raised ${raisedToday} requests today, which is our daily limit. Add to an existing request instead, or try again tomorrow.`;
		}
		const result = await raiseFeatureRequest(caller.supabase, caller.contact, {
			projectId: String(argumentValues.projectId ?? ''),
			title: String(argumentValues.title ?? '').trim(),
			want,
			benefit: String(argumentValues.benefit ?? '').trim()
		});
		if (result.outcome === 'not_your_project') {
			return 'That project is not one of yours. Call list_my_projects for the ones you can raise against.';
		}
		if (result.outcome === 'already_open') {
			return `You already have an open request saying much the same thing: ${result.reference}. Add to that one with comment_on_feature_request.`;
		}
		return `Raised as ${result.reference}. Someone will triage it and answer in its thread.`;
	}
};
