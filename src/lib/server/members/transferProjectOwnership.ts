import type { SupabaseClient } from '@supabase/supabase-js';

export async function transferProjectOwnership(
	supabase: SupabaseClient,
	projectId: string,
	newOwnerId: string
): Promise<void> {
	const { error } = await supabase.rpc('transfer_project_ownership', {
		project: projectId,
		new_owner: newOwnerId
	});
	if (error) throw error;
}
