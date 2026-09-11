import type { SupabaseClient } from '@supabase/supabase-js';

export async function removeProjectMember(
	supabase: SupabaseClient,
	projectId: string,
	accountId: string
): Promise<void> {
	const { error } = await supabase
		.from('project_members')
		.delete()
		.eq('project_id', projectId)
		.eq('account_id', accountId);
	if (error) throw error;
}
