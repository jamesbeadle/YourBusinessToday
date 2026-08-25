import type { SupabaseClient } from '@supabase/supabase-js';
import type { SystemAccountCode } from '$lib/data/accounting/systemAccountCodes';
import { AccountingError } from './accountingErrors';

export async function findSystemAccountId(
	supabase: SupabaseClient,
	code: SystemAccountCode
): Promise<string> {
	const { data, error } = await supabase
		.from('ledger_accounts')
		.select('id')
		.eq('code', code)
		.maybeSingle();
	if (error) throw error;
	if (data === null) throw new AccountingError(`Ledger account ${code} is missing.`);
	return data.id;
}
