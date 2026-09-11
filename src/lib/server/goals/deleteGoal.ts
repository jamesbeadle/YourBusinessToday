import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteGoal(supabase: SupabaseClient, goalId: string): Promise<void> {
	const { error } = await supabase.from('goals').delete().eq('id', goalId);
	if (error) throw error;
}
