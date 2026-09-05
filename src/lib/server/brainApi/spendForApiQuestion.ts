import type { BrainSpend } from '$lib/server/brain/spendForBrainWork';
import { creditsPerBrainQuestion } from '$lib/data/creditPricing';
import { refundCredits } from '$lib/server/credits/spendCredits';
import type { SupabaseClient } from '@supabase/supabase-js';

const apiQuestionReason = 'brain_api_question';

export async function spendForApiQuestion(
	supabase: SupabaseClient,
	tokenHash: string
): Promise<BrainSpend> {
	const { data, error } = await supabase.rpc('spend_for_brain_api_question', {
		p_token_hash: tokenHash
	});
	if (error === null) return { creditBalance: data };
	if (error.message.includes('insufficient_credits')) return 'insufficient_credits';
	if (error.message.includes('account_restricted')) return 'account_restricted';
	throw error;
}

export async function refundForApiQuestion(brainOwnerId: string): Promise<void> {
	await refundCredits(brainOwnerId, creditsPerBrainQuestion, apiQuestionReason);
}
