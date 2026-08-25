import type { SupabaseClient } from '@supabase/supabase-js';
import type { LedgerAccountType } from '$lib/data/accounting/ledgerAccountTypes';
import { AccountingError } from './accountingErrors';

const duplicateKeyCode = '23505';

export async function createLedgerAccount(
	supabase: SupabaseClient,
	account: { code: string; name: string; accountType: LedgerAccountType }
): Promise<void> {
	const { error } = await supabase.from('ledger_accounts').insert({
		code: account.code,
		name: account.name,
		account_type: account.accountType
	});
	if (error?.code === duplicateKeyCode) {
		throw new AccountingError(`Account code ${account.code} is already in use.`);
	}
	if (error) throw error;
}

export async function setLedgerAccountArchived(
	supabase: SupabaseClient,
	accountId: string,
	isArchived: boolean
): Promise<void> {
	const { error } = await supabase
		.from('ledger_accounts')
		.update({ is_archived: isArchived })
		.eq('id', accountId)
		.eq('is_system', false);
	if (error) throw error;
}
