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

// All three RPCs are service-role only: the server names the member and
// the price, so a browser can neither spend as someone else nor refund at
// will. The reserve is the effective model's floor; the settlement is
// whatever the marked-up bill owes beyond it once the answer exists.
export async function spendForChatbotQuestion(
	service: SupabaseClient,
	chatbotId: string,
	memberId: string,
	reserveCredits: number
): Promise<ChatbotSpend> {
	const { data, error } = await service.rpc('spend_for_chatbot_question', {
		target_chatbot: chatbotId,
		member: memberId,
		credit_amount: reserveCredits
	});
	if (error === null) return { allowanceRemaining: data };
	const refusal = refusals.find((candidate) => error.message.includes(candidate));
	if (refusal !== undefined) return refusal;
	throw error;
}

export async function refundForChatbotQuestion(
	service: SupabaseClient,
	chatbotId: string,
	memberId: string,
	reserveCredits: number
): Promise<void> {
	const { error } = await service.rpc('refund_for_chatbot_question', {
		target_chatbot: chatbotId,
		member: memberId,
		credit_amount: reserveCredits
	});
	if (error !== null) console.error('Chatbot refund failed', error);
}

// Returns what the pool could actually cover, which may be less than asked.
export async function settleChatbotQuestion(
	service: SupabaseClient,
	chatbotId: string,
	memberId: string,
	extraCredits: number
): Promise<number> {
	if (extraCredits <= 0) return 0;
	const { data, error } = await service.rpc('settle_chatbot_question', {
		target_chatbot: chatbotId,
		member: memberId,
		credit_amount: extraCredits
	});
	if (error !== null) {
		console.error('Chatbot settlement failed', error);
		return 0;
	}
	return data ?? 0;
}
