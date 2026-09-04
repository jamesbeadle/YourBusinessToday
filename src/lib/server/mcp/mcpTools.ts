import { commentOnFeatureRequestTool } from './tools/commentOnFeatureRequestTool';
import { getFeatureRequestTool } from './tools/getFeatureRequestTool';
import { listMyFeatureRequestsTool } from './tools/listMyFeatureRequestsTool';
import { listMyProjectsTool } from './tools/listMyProjectsTool';
import { raiseFeatureRequestTool } from './tools/raiseFeatureRequestTool';
import type { ContactCaller } from './resolveContactCaller';

export type McpTool = {
	name: string;
	title: string;
	description: string;
	inputSchema: Record<string, unknown>;
	run: (caller: ContactCaller, argumentValues: Record<string, unknown>) => Promise<string>;
};

// Deterministic order: clients cache tools/list, and a stable order keeps that
// cache warm.
export const mcpTools: McpTool[] = [
	listMyProjectsTool,
	listMyFeatureRequestsTool,
	getFeatureRequestTool,
	raiseFeatureRequestTool,
	commentOnFeatureRequestTool
];

export function findMcpTool(name: unknown): McpTool | null {
	return mcpTools.find((tool) => tool.name === name) ?? null;
}

export function describeMcpTools(): Record<string, unknown>[] {
	return mcpTools.map((tool) => ({
		name: tool.name,
		title: tool.title,
		description: tool.description,
		inputSchema: tool.inputSchema
	}));
}
