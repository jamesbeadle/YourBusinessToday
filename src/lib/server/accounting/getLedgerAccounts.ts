import type { SupabaseClient } from '@supabase/supabase-js';
import type { LedgerAccountType } from '$lib/data/accounting/ledgerAccountTypes';

export type LedgerAccount = {
	id: string;
	code: string;
	name: string;
	accountType: LedgerAccountType;
	isSystem: boolean;
	isArchived: boolean;
};

export async function getLedgerAccounts(supabase: SupabaseClient): Promise<LedgerAccount[]> {
	const { data, error } = await supabase.from('ledger_accounts').select('*').order('code');
	if (error) throw error;
	return data.map((row) => ({
		id: row.id,
		code: row.code,
		name: row.name,
		accountType: row.account_type,
		isSystem: row.is_system,
		isArchived: row.is_archived
	}));
}

export function activeAccountsOfType(
	accounts: LedgerAccount[],
	accountType: LedgerAccountType
): LedgerAccount[] {
	return accounts.filter((account) => account.accountType === accountType && !account.isArchived);
}
