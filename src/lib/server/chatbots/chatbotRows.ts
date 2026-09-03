import type { ChatbotSummary } from '$lib/data/chatbotTypes';

export type ChatbotRow = {
	id: string;
	knowledge_base_id: string;
	owner_id: string;
	name: string;
	pool_credits: number;
	is_paused: boolean;
	created_at: string;
	chatbot_members: { count: number }[];
};

export const chatbotColumns =
	'id, knowledge_base_id, owner_id, name, pool_credits, is_paused, created_at, chatbot_members(count)';

export function toChatbotSummary(row: ChatbotRow): ChatbotSummary {
	return {
		id: row.id,
		knowledgeBaseId: row.knowledge_base_id,
		ownerId: row.owner_id,
		name: row.name,
		poolCredits: row.pool_credits,
		isPaused: row.is_paused,
		memberCount: row.chatbot_members[0]?.count ?? 0,
		createdAt: row.created_at
	};
}
