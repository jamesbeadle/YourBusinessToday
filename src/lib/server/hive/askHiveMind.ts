import { answerTool, readPagesTool } from '../brain/modellerAnswerTools';
import { hiveMindQueryPrompt } from './hiveMindQueryPrompt';
import { hivePagesResultMessage, pagesReadByMember, readHivePages } from './readHivePagesExchange';
import { parseBrainAnswer } from '../brain/parseBrainAnswer';
import { renderHiveMindIndex, type HiveSpecialistModel } from './getHiveModelIndex';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import { toolUseNamed } from '../brain/readPagesExchange';
import type { AnthropicMessage } from '$lib/server/anthropic/anthropicTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

const maxAnswerTokens = 4000;

export type HiveConsultation = {
	answerMarkdown: string;
	citedPageKeys: string[];
	pagesReadCounts: Map<string, number>;
};

export async function askHiveMind(
	supabase: SupabaseClient,
	specialists: HiveSpecialistModel[],
	question: string
): Promise<HiveConsultation> {
	const system = `${hiveMindQueryPrompt}\n\n## The hive\n\n${renderHiveMindIndex(specialists)}`;
	const messages: AnthropicMessage[] = [{ role: 'user', content: question }];
	const firstResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		maxTokens: maxAnswerTokens
	});
	const readRequest = toolUseNamed(firstResponse.content, readPagesTool.name);
	if (readRequest === undefined) {
		return consultationFrom(firstResponse.content, new Map());
	}
	const pages = await readHivePages(supabase, readRequest);
	messages.push({ role: 'assistant', content: firstResponse.content });
	messages.push(hivePagesResultMessage(readRequest, pages));
	const secondResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		forcedToolName: answerTool.name,
		maxTokens: maxAnswerTokens
	});
	return consultationFrom(secondResponse.content, pagesReadByMember(pages));
}

function consultationFrom(
	content: unknown[],
	pagesReadCounts: Map<string, number>
): HiveConsultation {
	const answer = parseBrainAnswer(toolUseNamed(content, answerTool.name)?.input);
	return {
		answerMarkdown: answer.answerMarkdown,
		citedPageKeys: answer.citedSlugs,
		pagesReadCounts
	};
}
