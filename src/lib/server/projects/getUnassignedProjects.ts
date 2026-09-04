import type { SupabaseClient } from '@supabase/supabase-js';

export type UnassignedProject = { id: string; name: string };

export async function getUnassignedProjects(
	supabase: SupabaseClient
): Promise<UnassignedProject[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('id, name')
		.is('client_id', null)
		.eq('is_archived', false)
		.order('name');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		name: row.name as string
	}));
}
