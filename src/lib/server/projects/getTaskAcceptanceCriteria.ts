import type { SupabaseClient } from '@supabase/supabase-js';
import {
	parseCriterionRecord,
	type AcceptanceCriterion
} from '$lib/server/projects/criterionRecord';

export async function getTaskAcceptanceCriteria(
	supabase: SupabaseClient,
	taskId: string
): Promise<AcceptanceCriterion[]> {
	const { data, error } = await supabase
		.from('acceptance_criteria')
		.select('*')
		.eq('task_id', taskId)
		.order('position', { ascending: true });
	if (error) throw error;
	return data.map(parseCriterionRecord);
}
