import type { SupabaseClient } from '@supabase/supabase-js';

export async function setProjectArchived(
	supabase: SupabaseClient,
	projectId: string,
	isArchived: boolean
): Promise<void> {
	const { error } = await supabase
		.from('projects')
		.update({ is_archived: isArchived })
		.eq('id', projectId);
	if (error) throw error;
}
