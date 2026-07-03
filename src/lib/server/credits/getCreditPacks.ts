import type { SupabaseClient } from '@supabase/supabase-js';

export type CreditPack = {
	id: string;
	name: string;
	credits: number;
	pricePence: number;
};

export async function getCreditPacks(supabase: SupabaseClient): Promise<CreditPack[]> {
	const { data, error } = await supabase.from('credit_packs').select().order('price_pence');
	if (error) throw error;
	return data.map((row) => ({
		id: row.id,
		name: row.name,
		credits: row.credits,
		pricePence: row.price_pence
	}));
}
