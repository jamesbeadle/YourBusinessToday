import { McpErrorCode, jsonRpcVersion, mcpFailure } from './mcpErrors';
import { describeMcpTools, findMcpTool } from './mcpTools';
import {
	latestProtocolVersion,
	listCacheHints,
	negotiateProtocolVersion,
	serverInformation,
	supportedProtocolVersions
} from './mcpProtocol';
import type { ContactCaller } from './resolveContactCaller';
import type { McpRequest } from './readMcpRequest';

type McpAnswer = Record<string, unknown>;

const capabilities = { tools: { listChanged: false } };

const methods: Record<string, (caller: ContactCaller, request: McpRequest) => Promise<McpAnswer>> = {
	'server/discover': async () => discovery(),
	initialize: async (caller, request) => ({
		protocolVersion: negotiateProtocolVersion(request.params.protocolVersion),
		capabilities,
		serverInfo: serverInformation
	}),
	'tools/list': async () => ({ tools: describeMcpTools(), ...listCacheHints }),
	'tools/call': (caller, request) => callTool(caller, request)
};

export async function answerMcpRequest(caller: ContactCaller, request: McpRequest) {
	const method = methods[request.method];
	if (method === undefined) {
		return mcpFailure(request.id, McpErrorCode.MethodNotFound, `Unknown method ${request.method}`);
	}
	const result = await method(caller, request);
	return { jsonrpc: jsonRpcVersion, id: request.id, result: { resultType: 'complete', ...result } };
}

function discovery(): McpAnswer {
	return {
		protocolVersions: supportedProtocolVersions,
		latestProtocolVersion,
		capabilities,
		serverInfo: serverInformation
	};
}

async function callTool(caller: ContactCaller, request: McpRequest): Promise<McpAnswer> {
	const tool = findMcpTool(request.params.name);
	if (tool === null) {
		return toolAnswer(`There is no tool called ${String(request.params.name)}.`, true);
	}
	const argumentValues = (request.params.arguments ?? {}) as Record<string, unknown>;
	try {
		return toolAnswer(await tool.run(caller, argumentValues), false);
	} catch (failure) {
		console.error(`MCP tool ${tool.name} failed`, failure);
		return toolAnswer('That did not work. Try again shortly.', true);
	}
}

function toolAnswer(text: string, isError: boolean): McpAnswer {
	return { content: [{ type: 'text', text }], isError };
}
