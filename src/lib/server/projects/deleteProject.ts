import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteProject(supabase: SupabaseClient, projectId: string): Promise<void> {
	const { error } = await supabase.from('projects').delete().eq('id', projectId);
	if (error) throw error;
}
