import type { SupabaseClient } from '@supabase/supabase-js';
import { creditsPerTradeTalkQuestion } from '$lib/data/creditPricing';
import { refundCredits } from '$lib/server/credits/spendCredits';

export type HiveSpend = { creditBalance: number } | 'insufficient_credits' | 'account_restricted';

const hiveMindQuestionReason = 'hive_mind_question';

export async function spendForHiveMindQuestion(supabase: SupabaseClient): Promise<HiveSpend> {
	const { data, error } = await supabase.rpc('spend_for_hive_mind_question', {});
	if (error === null) return { creditBalance: data };
	if (error.message.includes('insufficient_credits')) return 'insufficient_credits';
	if (error.message.includes('account_restricted')) return 'account_restricted';
	throw error;
}

export async function refundForHiveMindQuestion(payerId: string): Promise<void> {
	await refundCredits(payerId, creditsPerTradeTalkQuestion, hiveMindQuestionReason);
}
