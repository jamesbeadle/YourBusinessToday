import { env } from '$env/dynamic/private';
import { anthropicMessagesUrl, anthropicVersion } from './anthropicConstants';
import { getSiteModel } from './getSiteModel';
import type { AnthropicMessage, AnthropicResponse, AnthropicTool } from './anthropicTypes';

export type AnthropicRequest = {
	system: string;
	messages: AnthropicMessage[];
	tools: AnthropicTool[];
	maxTokens: number;
	forcedToolName?: string;
};

export async function requestAnthropic(request: AnthropicRequest): Promise<AnthropicResponse> {
	const siteModel = await getSiteModel();
	const response = await fetch(anthropicMessagesUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': env.ANTHROPIC_API_KEY ?? '',
			'anthropic-version': anthropicVersion
		},
		body: JSON.stringify({
			model: siteModel,
			max_tokens: request.maxTokens,
			system: request.system,
			tools: request.tools,
			...toolChoiceFor(request),
			messages: request.messages
		})
	});
	if (!response.ok) throw new Error(`Anthropic request failed with status ${response.status}`);
	return response.json();
}

function toolChoiceFor(request: AnthropicRequest): Record<string, unknown> {
	if (request.forcedToolName === undefined) return {};
	return { tool_choice: { type: 'tool', name: request.forcedToolName } };
}
