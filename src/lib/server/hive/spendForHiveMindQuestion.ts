import type { SupabaseClient } from '@supabase/supabase-js';

export type HiveSpend = { creditBalance: number } | 'insufficient_credits' | 'account_restricted';

export async function spendForHiveMindQuestion(supabase: SupabaseClient): Promise<HiveSpend> {
	const { data, error } = await supabase.rpc('spend_for_hive_mind_question', {});
	if (error === null) return { creditBalance: data };
	if (error.message.includes('insufficient_credits')) return 'insufficient_credits';
	if (error.message.includes('account_restricted')) return 'account_restricted';
	throw error;
}

export async function refundForHiveMindQuestion(supabase: SupabaseClient): Promise<void> {
	const { error } = await supabase.rpc('refund_for_hive_mind_question', {});
	if (error !== null && !error.message.includes('nothing_to_refund')) throw error;
}
