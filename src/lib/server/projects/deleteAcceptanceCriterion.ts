import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteAcceptanceCriterion(
	supabase: SupabaseClient,
	criterionId: string
): Promise<void> {
	const { error } = await supabase.from('acceptance_criteria').delete().eq('id', criterionId);
	if (error) throw error;
}
