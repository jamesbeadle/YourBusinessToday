import type { SupabaseClient } from '@supabase/supabase-js';

export async function createSprint(
	supabase: SupabaseClient,
	projectId: string,
	name: string,
	startsOn: string | null,
	endsOn: string | null
): Promise<void> {
	const { error } = await supabase
		.from('sprints')
		.insert({ project_id: projectId, name, starts_on: startsOn, ends_on: endsOn });
	if (error) throw error;
}
