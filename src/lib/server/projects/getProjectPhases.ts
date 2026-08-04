import type { SupabaseClient } from '@supabase/supabase-js';
import { parsePhaseRecord, type Phase } from '$lib/server/projects/phaseRecord';

export async function getProjectPhases(
	supabase: SupabaseClient,
	projectId: string
): Promise<Phase[]> {
	const { data, error } = await supabase
		.from('phases')
		.select('*')
		.eq('project_id', projectId)
		.order('position', { ascending: true });
	if (error) throw error;
	return data.map(parsePhaseRecord);
}
