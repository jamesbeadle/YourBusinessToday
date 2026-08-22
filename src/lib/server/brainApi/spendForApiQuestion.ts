import type { BrainSpend } from '$lib/server/brain/spendForBrainWork';
import type { SupabaseClient } from '@supabase/supabase-js';

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

export async function refundForApiQuestion(
	supabase: SupabaseClient,
	tokenHash: string
): Promise<void> {
	const { error } = await supabase.rpc('refund_for_brain_api_question', {
		p_token_hash: tokenHash
	});
	if (error !== null && !error.message.includes('nothing_to_refund')) throw error;
}
