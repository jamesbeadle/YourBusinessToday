import type { SupabaseClient } from '@supabase/supabase-js';

export async function createPhase(
	supabase: SupabaseClient,
	projectId: string,
	name: string
): Promise<void> {
	const nextPosition = (await getHighestPosition(supabase, projectId)) + 1;
	const { error } = await supabase
		.from('phases')
		.insert({ project_id: projectId, name, position: nextPosition });
	if (error) throw error;
}

async function getHighestPosition(supabase: SupabaseClient, projectId: string): Promise<number> {
	const { data, error } = await supabase
		.from('phases')
		.select('position')
		.eq('project_id', projectId)
		.order('position', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.position ?? 0;
}
