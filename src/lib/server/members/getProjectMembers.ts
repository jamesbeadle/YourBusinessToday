import type { SupabaseClient } from '@supabase/supabase-js';
import { getAccountDirectory } from '$lib/server/accounts/getAccountDirectory';
import type { Account } from '$lib/server/accounts/accountRecord';

export async function getProjectMembers(
	supabase: SupabaseClient,
	projectId: string
): Promise<Account[]> {
	const { data, error } = await supabase
		.from('project_members')
		.select('account_id')
		.eq('project_id', projectId)
		.order('created_at');
	if (error) throw error;
	const accountIds = data.map((row: Record<string, unknown>) => row.account_id as string);
	const accounts = await getAccountDirectory(supabase, accountIds);
	return accountIds
		.map((accountId) => accounts.find((account) => account.id === accountId))
		.filter((account): account is Account => account !== undefined);
}
