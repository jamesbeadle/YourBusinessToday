import type { SupabaseClient } from '@supabase/supabase-js';

export async function createProject(
	supabase: SupabaseClient,
	name: string,
	description: string,
	createdBy: string
): Promise<void> {
	const { error } = await supabase
		.from('projects')
		.insert({ name, description, created_by: createdBy });
	if (error) throw error;
}
