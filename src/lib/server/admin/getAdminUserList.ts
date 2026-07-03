import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminUserSummary = {
	email: string;
	credits: number;
	isAdmin: boolean;
	isRestricted: boolean;
	joinedAt: string;
};

export async function getAdminUserList(supabase: SupabaseClient): Promise<AdminUserSummary[]> {
	const { data, error } = await supabase.rpc('admin_list_users');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		email: row.email as string,
		credits: row.credits as number,
		isAdmin: row.is_admin as boolean,
		isRestricted: row.is_restricted as boolean,
		joinedAt: row.joined_at as string
	}));
}
