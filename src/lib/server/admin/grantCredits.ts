import type { SupabaseClient } from '@supabase/supabase-js';

export async function grantCredits(
	supabase: SupabaseClient,
	targetEmail: string,
	creditAmount: number,
	note: string
): Promise<number> {
	const { data, error } = await supabase.rpc('admin_grant_credits', {
		target_email: targetEmail,
		credit_amount: creditAmount,
		note
	});
	if (error) throw error;
	return data;
}
