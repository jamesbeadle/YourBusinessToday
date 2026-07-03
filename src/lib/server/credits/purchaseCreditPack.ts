import type { SupabaseClient } from '@supabase/supabase-js';

export async function purchaseCreditPack(
	supabase: SupabaseClient,
	packId: string
): Promise<number> {
	const { data, error } = await supabase.rpc('purchase_credit_pack', { pack_identifier: packId });
	if (error) throw error;
	return data;
}
