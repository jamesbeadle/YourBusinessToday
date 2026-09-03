import { error, json } from '@sveltejs/kit';
import { fileHarvestedKnowledge } from '$lib/server/agent/fileHarvestedKnowledge';
import { creditsPerReply, harvestCreditsFor, questionFloorCreditsFor } from '$lib/data/creditPricing';
import { resolveRequestModel } from '$lib/server/anthropic/resolveRequestModel';
import { settleQuestionUsage } from '$lib/server/credits/settleQuestionUsage';
import { spendCredits } from '$lib/server/credits/spendCredits';
import { getLatestWorkflowMap } from '$lib/server/maps/getLatestWorkflowMap';
import { getSessionConversation } from '$lib/server/agent/getSessionConversation';
import { getWorkflow } from '$lib/server/entities/getWorkflow';
import { recordAgentMessage } from '$lib/server/agent/recordAgentMessage';
import { replyFromAgent } from '$lib/server/agent/replyFromAgent';
import { saveWorkflowMap } from '$lib/server/maps/saveWorkflowMap';
import { spendForAgentReply } from '$lib/server/agent/spendForAgentReply';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 300 };

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to talk to the agent');

	const { sessionId, workflowId, message } = await readChatRequest(request);
	const workflow = await getWorkflow(locals.supabase, workflowId);
	if (workflow === null) error(404, 'That workflow could not be found');
	const spend = await spendForAgentReply(locals.supabase, sessionId);
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');
	const reserve = await reserveModelFloor(locals);

	await recordAgentMessage(locals.supabase, {
		sessionId,
		userId: user.id,
		workflowId: workflow.id,
		author: 'user',
		body: message
	});
	const conversation = await getSessionConversation(locals.supabase, sessionId);
	const currentMap = await getLatestWorkflowMap(locals.supabase, workflow.id);
	const agentTurn = await replyFromAgent(conversation, currentMap);
	await recordAgentMessage(locals.supabase, {
		sessionId,
		userId: user.id,
		workflowId: workflow.id,
		author: 'agent',
		body: agentTurn.reply
	});
	if (JSON.stringify(agentTurn.map) !== JSON.stringify(currentMap)) {
		await saveWorkflowMap(locals.supabase, workflow.id, agentTurn.map);
	}
	await fileHarvestedKnowledge(locals.supabase, workflow.entityId, agentTurn.harvest);
	await chargeForHarvest(locals, agentTurn.harvest);
	const usageBalance = await settleQuestionUsage(user.id, reserve, 'agent_reply');

	return json({
		reply: agentTurn.reply,
		map: agentTurn.map,
		creditBalance: usageBalance ?? spend.creditBalance
	});
};

// spend_for_agent_reply takes the fixed 10; a dearer model tops the reserve
// up to its floor under the same reason, so settlement measures from the floor.
async function reserveModelFloor(locals: App.Locals): Promise<number> {
	const floor = questionFloorCreditsFor(await resolveRequestModel());
	const topUp = floor - creditsPerReply;
	if (topUp <= 0) return creditsPerReply;
	const spend = await spendCredits(locals.supabase, topUp, 'agent_reply');
	if (spend === 'insufficient_credits') error(402, 'You are out of credits');
	if (spend === 'account_restricted') error(403, 'This account is currently restricted');
	return floor;
}

async function chargeForHarvest(
	locals: App.Locals,
	harvest: { expertiseFacts: string[]; experienceEvents: unknown[] }
): Promise<void> {
	const itemCount = harvest.expertiseFacts.length + harvest.experienceEvents.length;
	const harvestCost = harvestCreditsFor(itemCount);
	if (harvestCost === 0) return;
	await spendCredits(locals.supabase, harvestCost, 'knowledge_harvest').catch(() => undefined);
}

async function readChatRequest(
	request: Request
): Promise<{ sessionId: string; workflowId: string; message: string }> {
	const payload = await request.json();
	const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId : '';
	const workflowId = typeof payload.workflowId === 'string' ? payload.workflowId : '';
	const message = typeof payload.message === 'string' ? payload.message.trim() : '';
	if (sessionId === '' || workflowId === '' || message === '') {
		error(400, 'A session, a workflow, and a message are required');
	}
	return { sessionId, workflowId, message };
}
