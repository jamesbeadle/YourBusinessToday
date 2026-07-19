import { ingestLibrarianPrompt } from './ingestLibrarianPrompt';
import { parseIngestRecord } from './parseIngestRecord';
import { renderBrainPageIndex } from './getBrainPageIndex';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import { toolUseFrom } from '$lib/server/anthropic/anthropicTypes';
import { updateWikiTool } from './updateWikiTool';
import type { BrainPageSummary } from '$lib/data/brainTypes';
import type { IngestRecord } from './parseIngestRecord';

const maxIngestTokens = 16_000;

export async function ingestSource(
	contentBlock: unknown,
	filename: string,
	index: BrainPageSummary[]
): Promise<IngestRecord> {
	const response = await requestAnthropic({
		system: systemPromptWithIndex(index),
		messages: [{ role: 'user', content: [instructionBlock(filename), contentBlock] }],
		tools: [updateWikiTool],
		forcedToolName: updateWikiTool.name,
		maxTokens: maxIngestTokens
	});
	if (response.stop_reason === 'max_tokens') {
		throw new Error('Ingest ran out of room before finishing the wiki update');
	}
	const record = parseIngestRecord(toolUseFrom(response, updateWikiTool.name));
	if (record === null) throw new Error('Ingest produced no usable wiki update');
	return record;
}

function systemPromptWithIndex(index: BrainPageSummary[]): string {
	return `${ingestLibrarianPrompt}\n\n## Current wiki index\n\n${renderBrainPageIndex(index)}`;
}

function instructionBlock(filename: string) {
	return {
		type: 'text',
		text: `Ingest this source document into the wiki. Its filename is "${filename}".`
	};
}
