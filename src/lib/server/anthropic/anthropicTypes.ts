export type AnthropicTextBlock = { type: 'text'; text: string };

export type AnthropicToolUseBlock = { type: 'tool_use'; id: string; name: string; input: unknown };

export type AnthropicContentBlock = AnthropicTextBlock | AnthropicToolUseBlock | { type: string };

export type AnthropicMessage = { role: 'user' | 'assistant'; content: unknown };

export type AnthropicTool = { name: string; description: string; input_schema: unknown };

export type AnthropicResponse = {
	content: AnthropicContentBlock[];
	stop_reason: string;
};

export function toolUseFrom(response: AnthropicResponse, toolName: string): unknown | undefined {
	const block = response.content.find(
		(candidate): candidate is AnthropicToolUseBlock =>
			candidate.type === 'tool_use' && (candidate as AnthropicToolUseBlock).name === toolName
	);
	return block?.input;
}
