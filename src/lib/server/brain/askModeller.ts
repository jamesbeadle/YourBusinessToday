import { answerTool, readPagesTool } from './modellerAnswerTools';
import { modellerQueryPrompt } from './modellerQueryPrompt';
import { parseBrainAnswer } from './parseBrainAnswer';
import { readPagesResultMessage, toolUseNamed } from './readPagesExchange';
import { renderDomainModelIndex } from './getBrainPageIndex';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import type { AnthropicMessage } from '$lib/server/anthropic/anthropicTypes';
import type { BrainAnswer, BrainContext, BrainPageSummary } from '$lib/data/brainTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

const maxAnswerTokens = 4000;

export async function askModeller(
	supabase: SupabaseClient,
	contexts: BrainContext[],
	index: BrainPageSummary[],
	question: string
): Promise<BrainAnswer> {
	const system = `${modellerQueryPrompt}\n\n## Model index\n\n${renderDomainModelIndex(contexts, index)}`;
	const messages: AnthropicMessage[] = [{ role: 'user', content: question }];
	const firstResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		maxTokens: maxAnswerTokens
	});
	const readRequest = toolUseNamed(firstResponse.content, readPagesTool.name);
	if (readRequest === undefined) {
		return parseBrainAnswer(toolUseNamed(firstResponse.content, answerTool.name)?.input);
	}
	messages.push({ role: 'assistant', content: firstResponse.content });
	messages.push(await readPagesResultMessage(supabase, readRequest));
	const secondResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		forcedToolName: answerTool.name,
		maxTokens: maxAnswerTokens
	});
	return parseBrainAnswer(toolUseNamed(secondResponse.content, answerTool.name)?.input);
}
