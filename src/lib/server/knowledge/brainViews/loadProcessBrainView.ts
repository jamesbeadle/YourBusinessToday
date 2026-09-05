import { getConversationHistory } from '$lib/server/agent/getConversationHistory';
import { getLatestWorkflowMap } from '$lib/server/maps/getLatestWorkflowMap';
import { getMapViewers, type MapViewer } from '$lib/server/maps/getMapViewers';
import type { ChatMessage } from '$lib/data/chatTypes';
import type { WorkflowModel } from '$lib/data/workflowModel';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ProcessBrainView = {
	kind: 'process';
	workflowId: string;
	messages: ChatMessage[];
	latestMap: WorkflowModel;
	viewers: MapViewer[];
};

export async function loadProcessBrainView(
	supabase: SupabaseClient,
	workflowId: string
): Promise<ProcessBrainView> {
	return {
		kind: 'process',
		workflowId,
		messages: await conversationMessages(supabase, workflowId),
		latestMap: await getLatestWorkflowMap(supabase, workflowId),
		viewers: await getMapViewers(supabase, workflowId)
	};
}

async function conversationMessages(
	supabase: SupabaseClient,
	workflowId: string
): Promise<ChatMessage[]> {
	const history = await getConversationHistory(supabase, workflowId);
	return history.map((turn, turnIndex) => ({ id: turnIndex, author: turn.author, text: turn.body }));
}
