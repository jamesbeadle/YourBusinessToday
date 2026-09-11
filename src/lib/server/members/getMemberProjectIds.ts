import type { SupabaseClient } from '@supabase/supabase-js';

export async function getMemberProjectIds(
	supabase: SupabaseClient,
	accountId: string
): Promise<string[]> {
	const { data, error } = await supabase
		.from('project_members')
		.select('project_id')
		.eq('account_id', accountId);
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => row.project_id as string);
}
