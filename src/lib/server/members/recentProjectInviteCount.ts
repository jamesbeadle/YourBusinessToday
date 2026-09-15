import { inviteWindowStart } from '$lib/server/email/inviteAllowance';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function countProjectInvitesThisHour(
	supabase: SupabaseClient,
	inviterAccountId: string
): Promise<number> {
	const { count, error } = await supabase
		.from('project_members')
		.select('project_id', { count: 'exact', head: true })
		.eq('added_by', inviterAccountId)
		.gte('created_at', inviteWindowStart());
	if (error !== null) throw error;
	return count ?? 0;
}
