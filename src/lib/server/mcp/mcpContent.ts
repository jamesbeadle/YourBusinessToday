export type McpTextBlock = { type: 'text'; text: string };
export type McpImageBlock = { type: 'image'; data: string; mimeType: string };
type EmbeddedFile = { uri: string; mimeType: string; blob: string };
type EmbeddedText = { uri: string; mimeType: string; text: string };
export type McpResourceBlock = { type: 'resource'; resource: EmbeddedFile | EmbeddedText };
export type McpContentBlock = McpTextBlock | McpImageBlock | McpResourceBlock;

/** What a tool hands back: a sentence or two, or content the client renders block by block. */
export type McpToolAnswer = string | McpContentBlock[];

export function textBlock(text: string): McpTextBlock {
	return { type: 'text', text };
}

export function imageBlock(bytes: Uint8Array, mimeType: string): McpImageBlock {
	return { type: 'image', data: base64Of(bytes), mimeType };
}

export function fileBlock(uri: string, mimeType: string, bytes: Uint8Array): McpResourceBlock {
	return { type: 'resource', resource: { uri, mimeType, blob: base64Of(bytes) } };
}

export function contentBlocksOf(answer: McpToolAnswer): McpContentBlock[] {
	if (typeof answer === 'string') return [textBlock(answer)];
	return answer;
}

function base64Of(bytes: Uint8Array): string {
	return Buffer.from(bytes).toString('base64');
}
