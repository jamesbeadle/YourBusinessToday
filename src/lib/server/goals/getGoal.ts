import type { SupabaseClient } from '@supabase/supabase-js';
import { parseGoalRecord, type Goal } from './goalRecord';

export async function getGoal(supabase: SupabaseClient, goalId: string): Promise<Goal | null> {
	const { data, error } = await supabase.from('goals').select('*').eq('id', goalId).maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseGoalRecord(data);
}
