import type { SupabaseClient } from '@supabase/supabase-js';

export type CreditSpend = { creditBalance: number } | 'insufficient_credits' | 'account_restricted';

export async function spendCredits(
	supabase: SupabaseClient,
	amount: number,
	reason: string
): Promise<CreditSpend> {
	const { data, error } = await supabase.rpc('spend_credits_for', {
		amount,
		spend_reason: reason
	});
	if (error === null) return { creditBalance: data };
	if (error.message.includes('insufficient_credits')) return 'insufficient_credits';
	if (error.message.includes('account_restricted')) return 'account_restricted';
	throw error;
}

export async function refundCredits(
	supabase: SupabaseClient,
	amount: number,
	reason: string
): Promise<void> {
	const { error } = await supabase.rpc('refund_credits_for', {
		amount,
		refund_reason: reason
	});
	if (error !== null && !error.message.includes('nothing_to_refund')) throw error;
}
