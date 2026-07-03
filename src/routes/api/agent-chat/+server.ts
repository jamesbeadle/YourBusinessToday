import { error, json } from '@sveltejs/kit';
import { getLatestWorkflowMap } from '$lib/server/maps/getLatestWorkflowMap';
import { getSessionConversation } from '$lib/server/agent/getSessionConversation';
import { recordAgentMessage } from '$lib/server/agent/recordAgentMessage';
import { replyFromAgent } from '$lib/server/agent/replyFromAgent';
import { saveWorkflowMap } from '$lib/server/maps/saveWorkflowMap';
import { spendForAgentReply } from '$lib/server/agent/spendForAgentReply';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to talk to the agent');

	const { sessionId, message } = await readChatRequest(request);
	const spend = await spendForAgentReply(locals.supabase, sessionId);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');

	await recordAgentMessage(locals.supabase, {
		sessionId,
		userId: user.id,
		author: 'user',
		body: message
	});
	const conversation = await getSessionConversation(locals.supabase, sessionId);
	const currentMap = await getLatestWorkflowMap(locals.supabase);
	const agentTurn = await replyFromAgent(conversation, currentMap);
	await recordAgentMessage(locals.supabase, {
		sessionId,
		userId: user.id,
		author: 'agent',
		body: agentTurn.reply
	});
	if (JSON.stringify(agentTurn.map) !== JSON.stringify(currentMap)) {
		await saveWorkflowMap(locals.supabase, agentTurn.map);
	}

	return json({
		reply: agentTurn.reply,
		map: agentTurn.map,
		creditBalance: spend.creditBalance
	});
};

async function readChatRequest(request: Request): Promise<{ sessionId: string; message: string }> {
	const payload = await request.json();
	const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId : '';
	const message = typeof payload.message === 'string' ? payload.message.trim() : '';
	if (sessionId === '' || message === '') error(400, 'A session and a message are required');
	return { sessionId, message };
}
