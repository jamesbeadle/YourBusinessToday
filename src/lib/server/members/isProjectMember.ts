import type { SupabaseClient } from '@supabase/supabase-js';

export async function isProjectMember(
	supabase: SupabaseClient,
	projectId: string,
	accountId: string
): Promise<boolean> {
	const { count, error } = await supabase
		.from('project_members')
		.select('project_id', { count: 'exact', head: true })
		.eq('project_id', projectId)
		.eq('account_id', accountId);
	if (error) throw error;
	return (count ?? 0) > 0;
}
