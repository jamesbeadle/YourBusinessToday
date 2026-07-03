import { env } from '$env/dynamic/private';
import { agentSystemPrompt } from './agentSystemPrompt';
import { agentReplyForTurn } from '$lib/data/scriptedAgent';
import { parseWorkflowModel } from './parseWorkflowModel';
import { workspaceUpdateTool } from './workspaceUpdateTool';
import type { ConversationTurn } from './conversationTypes';
import type { WorkflowModel } from '$lib/data/workflowModel';

const anthropicMessagesUrl = 'https://api.anthropic.com/v1/messages';
const anthropicVersion = '2023-06-01';
const agentModel = 'claude-sonnet-4-5';
const maxReplyTokens = 3000;

export type AgentTurn = { reply: string; map: WorkflowModel };

export async function replyFromAgent(
	conversation: ConversationTurn[],
	currentMap: WorkflowModel
): Promise<AgentTurn> {
	if (!env.ANTHROPIC_API_KEY) return { reply: scriptedReply(conversation), map: currentMap };
	const workspaceUpdate = await requestWorkspaceUpdate(conversation, currentMap);
	return {
		reply: asReplyText(workspaceUpdate.reply),
		map: parseWorkflowModel(workspaceUpdate.map) ?? currentMap
	};
}

async function requestWorkspaceUpdate(
	conversation: ConversationTurn[],
	currentMap: WorkflowModel
): Promise<{ reply: unknown; map: unknown }> {
	const response = await fetch(anthropicMessagesUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': env.ANTHROPIC_API_KEY ?? '',
			'anthropic-version': anthropicVersion
		},
		body: JSON.stringify({
			model: agentModel,
			max_tokens: maxReplyTokens,
			system: systemPromptWithMap(currentMap),
			tools: [workspaceUpdateTool],
			tool_choice: { type: 'tool', name: workspaceUpdateTool.name },
			messages: conversation.map(asAnthropicMessage)
		})
	});
	if (!response.ok) throw new Error(`Agent request failed with status ${response.status}`);
	const payload = await response.json();
	const toolUse = payload.content.find((block: { type: string }) => block.type === 'tool_use');
	if (toolUse === undefined) throw new Error('Agent response contained no workspace update');
	return toolUse.input;
}

function systemPromptWithMap(currentMap: WorkflowModel): string {
	return `${agentSystemPrompt}\n\n## Current Workflow Map model\n\n${JSON.stringify(currentMap)}`;
}

function asAnthropicMessage(turn: ConversationTurn) {
	return {
		role: turn.author === 'agent' ? 'assistant' : 'user',
		content: turn.body
	};
}

function asReplyText(reply: unknown): string {
	if (typeof reply === 'string' && reply.trim() !== '') return reply;
	return 'Tell me more about how that part of the business works.';
}

function scriptedReply(conversation: ConversationTurn[]): string {
	const userTurnCount = conversation.filter((turn) => turn.author === 'user').length;
	return agentReplyForTurn(userTurnCount);
}
