import type { SupabaseClient } from '@supabase/supabase-js';

export type ProjectChoice = { id: string; name: string };

/**
 * The projects a person can move work to: every one they are on apart from
 * the one they are looking at. Row level security does the reaching.
 */
export async function getOtherProjects(
	supabase: SupabaseClient,
	exceptProjectId: string
): Promise<ProjectChoice[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('id, name')
		.neq('id', exceptProjectId)
		.order('name');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		name: row.name as string
	}));
}
