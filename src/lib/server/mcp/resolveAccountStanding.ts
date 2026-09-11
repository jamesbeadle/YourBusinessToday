import { getMemberProjectIds } from '$lib/server/members/getMemberProjectIds';
import type { SupabaseClient } from '@supabase/supabase-js';

export type McpRole = 'staff' | 'member' | 'none';

export type AccountStanding = {
	accountId: string;
	email: string;
	role: McpRole;
	isAdmin: boolean;
	memberProjectIds: string[];
};

export async function resolveAccountStanding(
	supabase: SupabaseClient,
	accountId: string
): Promise<AccountStanding> {
	const { data, error } = await supabase
		.from('profiles')
		.select('email, is_staff, is_admin, is_restricted')
		.eq('id', accountId)
		.maybeSingle();
	if (error) throw error;
	const email = data?.email ?? '';
	if (data?.is_restricted === true) return nobody(accountId, email);
	if (data?.is_staff === true || data?.is_admin === true) {
		return { accountId, email, role: 'staff', isAdmin: data.is_admin === true, memberProjectIds: [] };
	}
	const memberProjectIds = await getMemberProjectIds(supabase, accountId);
	if (memberProjectIds.length === 0) return nobody(accountId, email);
	return { accountId, email, role: 'member', isAdmin: false, memberProjectIds };
}

function nobody(accountId: string, email: string): AccountStanding {
	return { accountId, email, role: 'none', isAdmin: false, memberProjectIds: [] };
}
