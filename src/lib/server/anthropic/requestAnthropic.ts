import { env } from '$env/dynamic/private';
import { anthropicMessagesUrl, anthropicVersion } from './anthropicConstants';
import { getSiteModel } from './getSiteModel';
import { requestModelOverride } from './modelContext';
import type { AnthropicMessage, AnthropicResponse, AnthropicTool } from './anthropicTypes';

const failureDetailLimit = 300;

export type AnthropicRequest = {
	system: string;
	messages: AnthropicMessage[];
	tools: AnthropicTool[];
	maxTokens: number;
	forcedToolName?: string;
};

export async function requestAnthropic(request: AnthropicRequest): Promise<AnthropicResponse> {
	if ((env.ANTHROPIC_API_KEY ?? '') === '') {
		throw new Error('ANTHROPIC_API_KEY is not set — add it to .env');
	}
	const response = await fetch(anthropicMessagesUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': env.ANTHROPIC_API_KEY ?? '',
			'anthropic-version': anthropicVersion
		},
		body: JSON.stringify({
			model: (await requestModelOverride()) ?? (await getSiteModel()),
			max_tokens: request.maxTokens,
			system: request.system,
			tools: request.tools,
			...toolChoiceFor(request),
			messages: request.messages
		})
	});
	if (!response.ok) throw new Error(await describeFailure(response));
	return response.json();
}

async function describeFailure(response: Response): Promise<string> {
	const detail = (await response.text()).slice(0, failureDetailLimit);
	return `Anthropic request failed with status ${response.status}: ${detail}`;
}

function toolChoiceFor(request: AnthropicRequest): Record<string, unknown> {
	if (request.forcedToolName === undefined) return {};
	return { tool_choice: { type: 'tool', name: request.forcedToolName } };
}
