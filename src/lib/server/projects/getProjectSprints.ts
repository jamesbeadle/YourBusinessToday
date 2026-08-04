import type { SupabaseClient } from '@supabase/supabase-js';
import { parseSprintRecord, type Sprint } from '$lib/server/projects/sprintRecord';

export async function getProjectSprints(
	supabase: SupabaseClient,
	projectId: string
): Promise<Sprint[]> {
	const { data, error } = await supabase
		.from('sprints')
		.select('*')
		.eq('project_id', projectId)
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map(parseSprintRecord);
}
