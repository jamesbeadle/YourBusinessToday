import { creditsPerChatbotQuestion } from '$lib/data/creditPricing';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ChatbotSpend =
	| { allowanceRemaining: number }
	| 'chatbot_out_of_credits'
	| 'allowance_exhausted'
	| 'chatbot_paused'
	| 'not_a_member';

const refusals: Exclude<ChatbotSpend, object>[] = [
	'chatbot_out_of_credits',
	'allowance_exhausted',
	'chatbot_paused',
	'not_a_member'
];

// Both RPCs are service-role only: the server names the member and the
// price, so a browser can neither spend as someone else nor refund at will.
export async function spendForChatbotQuestion(
	service: SupabaseClient,
	chatbotId: string,
	memberId: string
): Promise<ChatbotSpend> {
	const { data, error } = await service.rpc('spend_for_chatbot_question', {
		target_chatbot: chatbotId,
		member: memberId,
		credit_amount: creditsPerChatbotQuestion
	});
	if (error === null) return { allowanceRemaining: data };
	const refusal = refusals.find((candidate) => error.message.includes(candidate));
	if (refusal !== undefined) return refusal;
	throw error;
}

// A refund that cannot land (the member was removed mid-question) is logged,
// not thrown: the caller is already on its failure path.
export async function refundForChatbotQuestion(
	service: SupabaseClient,
	chatbotId: string,
	memberId: string
): Promise<void> {
	const { error } = await service.rpc('refund_for_chatbot_question', {
		target_chatbot: chatbotId,
		member: memberId,
		credit_amount: creditsPerChatbotQuestion
	});
	if (error !== null) console.error('Chatbot refund failed', error);
}
