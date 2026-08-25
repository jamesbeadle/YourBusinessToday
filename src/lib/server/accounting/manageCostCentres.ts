import type { SupabaseClient } from '@supabase/supabase-js';

export async function createCostCentre(supabase: SupabaseClient, name: string): Promise<void> {
	const { error } = await supabase.from('cost_centres').insert({ name });
	if (error) throw error;
}

export async function setCostCentreArchived(
	supabase: SupabaseClient,
	costCentreId: string,
	isArchived: boolean
): Promise<void> {
	const { error } = await supabase
		.from('cost_centres')
		.update({ is_archived: isArchived })
		.eq('id', costCentreId);
	if (error) throw error;
}
