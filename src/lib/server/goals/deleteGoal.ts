import type { SupabaseClient } from '@supabase/supabase-js';
import { compactGoalRanks } from '$lib/server/ordering/compactInDatabase';
import { getGoal } from '$lib/server/goals/getGoal';

export async function deleteGoal(supabase: SupabaseClient, goalId: string): Promise<void> {
	const goal = await getGoal(supabase, goalId);
	const { error } = await supabase.from('goals').delete().eq('id', goalId);
	if (error) throw error;
	if (goal === null) return;
	await compactGoalRanks(supabase, goal.projectId);
}
