import { questionCreditsFor } from '$lib/data/creditPricing';
import { meteredCallsSoFar } from '$lib/server/anthropic/modelContext';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';

// Reserve-then-settle: the tier floor was taken before the work; once the
// answer is in, anything the marked-up bill owes beyond it is taken now
// through the service-role settle_credits_for, which has no balance check
// — a settlement that could bounce would make the floor the real price.
// Returns the payer's new balance, or null when nothing more was owed.
export async function settleQuestionUsage(
	payerId: string,
	reservedCredits: number,
	reason: string
): Promise<number | null> {
	const owed = questionCreditsFor(meteredCallsSoFar());
	const extra = owed - reservedCredits;
	if (extra <= 0) return null;
	const { data, error } = await supabaseServiceClient().rpc('settle_credits_for', {
		payer: payerId,
		credit_amount: extra,
		settle_reason: `${reason}_usage`
	});
	if (error !== null) {
		console.error('Usage settlement failed', error);
		return null;
	}
	return data;
}
