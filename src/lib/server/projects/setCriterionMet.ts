import type { SupabaseClient } from '@supabase/supabase-js';

export async function setCriterionMet(
	supabase: SupabaseClient,
	criterionId: string,
	isMet: boolean
): Promise<void> {
	const { error } = await supabase
		.from('acceptance_criteria')
		.update({ is_met: isMet })
		.eq('id', criterionId);
	if (error) throw error;
}
