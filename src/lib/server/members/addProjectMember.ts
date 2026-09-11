import type { SupabaseClient } from '@supabase/supabase-js';

export async function addProjectMember(
	supabase: SupabaseClient,
	projectId: string,
	accountId: string,
	addedBy: string
): Promise<void> {
	const { error } = await supabase
		.from('project_members')
		.upsert(
			{ project_id: projectId, account_id: accountId, added_by: addedBy },
			{ onConflict: 'project_id,account_id', ignoreDuplicates: true }
		);
	if (error) throw error;
}
