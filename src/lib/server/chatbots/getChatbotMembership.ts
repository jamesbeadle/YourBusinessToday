import type { ChatbotMembership } from '$lib/data/chatbotTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getChatbotMembership(
	supabase: SupabaseClient,
	chatbotId: string,
	userId: string
): Promise<ChatbotMembership | null> {
	const { data, error } = await supabase
		.from('chatbot_members')
		.select('allowance_credits, spent_credits')
		.eq('chatbot_id', chatbotId)
		.eq('member_id', userId)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return { allowanceCredits: data.allowance_credits, spentCredits: data.spent_credits };
}
