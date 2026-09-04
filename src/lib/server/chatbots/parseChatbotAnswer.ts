import { parseBrainAnswer } from '../brain/parseBrainAnswer';
import type { ChatbotAnswer } from '$lib/data/chatbotTypes';

const longestMissingKnowledge = 400;

export function parseChatbotAnswer(input: unknown): ChatbotAnswer {
	const answer = parseBrainAnswer(input);
	return {
		answerMarkdown: answer.answerMarkdown,
		citedPageKeys: answer.citedSlugs,
		missingKnowledge: missingKnowledgeFrom(input)
	};
}

function missingKnowledgeFrom(input: unknown): string | null {
	if (typeof input !== 'object' || input === null) return null;
	const candidate = (input as { missingKnowledge?: unknown }).missingKnowledge;
	if (typeof candidate !== 'string') return null;
	const stated = candidate.trim();
	if (stated === '') return null;
	return stated.slice(0, longestMissingKnowledge);
}
