import { answerTool, readPagesTool } from './librarianAnswerTools';
import { getBrainPagesBySlugs } from './getBrainPage';
import { parseBrainAnswer, parseRequestedSlugs } from './parseBrainAnswer';
import { queryLibrarianPrompt } from './queryLibrarianPrompt';
import { renderBrainPageIndex } from './getBrainPageIndex';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import type { AnthropicMessage, AnthropicToolUseBlock } from '$lib/server/anthropic/anthropicTypes';
import type { BrainAnswer, BrainPage, BrainPageSummary } from '$lib/data/brainTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

const maxAnswerTokens = 4000;

export async function askLibrarian(
	supabase: SupabaseClient,
	index: BrainPageSummary[],
	question: string
): Promise<BrainAnswer> {
	const system = `${queryLibrarianPrompt}\n\n## Wiki index\n\n${renderBrainPageIndex(index)}`;
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
	messages.push(await toolResultMessage(supabase, readRequest));
	const secondResponse = await requestAnthropic({
		system,
		messages,
		tools: [readPagesTool, answerTool],
		forcedToolName: answerTool.name,
		maxTokens: maxAnswerTokens
	});
	return parseBrainAnswer(toolUseNamed(secondResponse.content, answerTool.name)?.input);
}

function toolUseNamed(content: unknown[], name: string): AnthropicToolUseBlock | undefined {
	return content.find(
		(block): block is AnthropicToolUseBlock =>
			(block as AnthropicToolUseBlock).type === 'tool_use' &&
			(block as AnthropicToolUseBlock).name === name
	);
}

async function toolResultMessage(
	supabase: SupabaseClient,
	readRequest: AnthropicToolUseBlock
): Promise<AnthropicMessage> {
	const slugs = parseRequestedSlugs(readRequest.input);
	const pages = await getBrainPagesBySlugs(supabase, slugs);
	return {
		role: 'user',
		content: [
			{ type: 'tool_result', tool_use_id: readRequest.id, content: renderPages(slugs, pages) }
		]
	};
}

function renderPages(requestedSlugList: string[], pages: BrainPage[]): string {
	if (pages.length === 0) return 'None of the requested pages exist.';
	const missing = requestedSlugList.filter((slug) => !pages.some((page) => page.slug === slug));
	const rendered = pages.map((page) => `# ${page.title} (${page.slug})\n\n${page.body}`);
	if (missing.length > 0) rendered.push(`Pages that do not exist: ${missing.join(', ')}`);
	return rendered.join('\n\n---\n\n');
}
