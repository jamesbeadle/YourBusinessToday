import type { SupabaseClient } from '@supabase/supabase-js';

export type BrainSpend = { creditBalance: number } | 'insufficient_credits' | 'account_restricted';

export async function spendForBrainIngest(
	supabase: SupabaseClient,
	sourceId: string
): Promise<BrainSpend> {
	return spendThrough(supabase, 'spend_for_brain_ingest', { source_identifier: sourceId });
}

export async function spendForBrainQuestion(supabase: SupabaseClient): Promise<BrainSpend> {
	return spendThrough(supabase, 'spend_for_brain_question', {});
}

export async function refundForBrainIngest(supabase: SupabaseClient): Promise<void> {
	const { error } = await supabase.rpc('refund_for_brain_ingest', {});
	if (error !== null && !error.message.includes('nothing_to_refund')) throw error;
}

async function spendThrough(
	supabase: SupabaseClient,
	functionName: string,
	functionArguments: Record<string, string>
): Promise<BrainSpend> {
	const { data, error } = await supabase.rpc(functionName, functionArguments);
	if (error === null) return { creditBalance: data };
	if (error.message.includes('insufficient_credits')) return 'insufficient_credits';
	if (error.message.includes('account_restricted')) return 'account_restricted';
	throw error;
}
