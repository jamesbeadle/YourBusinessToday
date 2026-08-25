import type { SupabaseClient } from '@supabase/supabase-js';

export type CostCentre = { id: string; name: string; isArchived: boolean };

export async function getCostCentres(supabase: SupabaseClient): Promise<CostCentre[]> {
	const { data, error } = await supabase.from('cost_centres').select('*').order('name');
	if (error) throw error;
	return data.map((row) => ({ id: row.id, name: row.name, isArchived: row.is_archived }));
}

export function activeCostCentres(costCentres: CostCentre[]): CostCentre[] {
	return costCentres.filter((costCentre) => !costCentre.isArchived);
}
