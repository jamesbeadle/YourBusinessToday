import { json } from '@sveltejs/kit';
import { McpErrorCode, mcpFailure } from '$lib/server/mcp/mcpErrors';
import { answerMcpRequest } from '$lib/server/mcp/mcpMethods';
import { isNotification, readMcpRequest } from '$lib/server/mcp/readMcpRequest';
import { resolveContactCaller } from '$lib/server/mcp/resolveContactCaller';
import type { RequestHandler } from './$types';

const acknowledged = 202;
const unauthorised = 401;
const methodNotAllowed = 405;

export const POST: RequestHandler = async ({ request, url }) => {
	const caller = await resolveContactCaller(request);
	if (caller === null) return askForToken(url.origin);
	const payload = await request.json().catch(() => null);
	const mcpRequest = readMcpRequest(payload);
	if (mcpRequest === null) {
		return json(mcpFailure(null, McpErrorCode.InvalidRequest, 'That is not a JSON-RPC request'));
	}
	if (isNotification(mcpRequest)) return new Response(null, { status: acknowledged });
	return json(await answerMcpRequest(caller, mcpRequest));
};

// The transport has no server-initiated stream, so there is nothing to open.
export const GET: RequestHandler = async () =>
	new Response('This endpoint only answers JSON-RPC over POST.', { status: methodNotAllowed });

function askForToken(origin: string): Response {
	return new Response('Send a client access token as: Authorization: Bearer <token>', {
		status: unauthorised,
		headers: { 'WWW-Authenticate': `Bearer resource_metadata="${origin}/portal/access"` }
	});
}
