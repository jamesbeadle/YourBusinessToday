import { answerTool, readPagesTool } from '../brain/modellerAnswerTools';
import { chatbotQueryPrompt } from './chatbotQueryPrompt';
import { parseBrainAnswer } from '../brain/parseBrainAnswer';
import { readChatbotPages } from './readChatbotPages';
import { renderChatbotIndex } from './renderChatbotIndex';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import { toolUseNamed, toolUsesNamed } from '../brain/readPagesExchange';
import type { AnthropicMessage } from '$lib/server/anthropic/anthropicTypes';
import type { ChatbotAnswer, ChatbotSpeaker } from '$lib/data/chatbotTypes';
import type { ChatbotBrainModel } from './getChatbotBrains';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ChatbotTurn = { speaker: ChatbotSpeaker; text: string };

const maxAnswerTokens = 4000;

export async function askChatbot(
	supabase: SupabaseClient,
	chatbotName: string,
	brains: ChatbotBrainModel[],
	turns: ChatbotTurn[]
): Promise<ChatbotAnswer> {
	const system = `${chatbotQueryPrompt(chatbotName)}\n\n## The knowledge base\n\n${renderChatbotIndex(brains)}`;
	const messages = messagesFromTurns(turns);
	const firstResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		maxTokens: maxAnswerTokens
	});
	const hasImmediateAnswer = toolUseNamed(firstResponse.content, answerTool.name) !== undefined;
	const readRequests = hasImmediateAnswer
		? []
		: toolUsesNamed(firstResponse.content, readPagesTool.name);
	if (readRequests.length === 0) return answerFrom(firstResponse.content);
	messages.push({ role: 'assistant', content: firstResponse.content });
	messages.push(await readChatbotPages(supabase, brains, readRequests));
	const secondResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		forcedToolName: answerTool.name,
		maxTokens: maxAnswerTokens
	});
	return answerFrom(secondResponse.content);
}

function answerFrom(content: unknown[]): ChatbotAnswer {
	const answer = parseBrainAnswer(toolUseNamed(content, answerTool.name)?.input);
	return { answerMarkdown: answer.answerMarkdown, citedPageKeys: answer.citedSlugs };
}

function messagesFromTurns(turns: ChatbotTurn[]): AnthropicMessage[] {
	const firstMemberIndex = turns.findIndex((turn) => turn.speaker === 'member');
	if (firstMemberIndex < 0) return [];
	return turns.slice(firstMemberIndex).map((turn) => ({
		role: turn.speaker === 'member' ? 'user' : 'assistant',
		content: turn.text
	}));
}
