import type { SupabaseClient } from '@supabase/supabase-js';
import type { LedgerAccountType } from '$lib/data/accounting/ledgerAccountTypes';
import { readMoney } from './readNumeric';

export type LedgerEntry = {
	journalDate: string;
	accountId: string;
	accountCode: string;
	accountName: string;
	accountType: LedgerAccountType;
	costCentreId: string | null;
	debit: number;
	credit: number;
};

const pageSize = 1000;

export async function getLedgerEntriesUpTo(
	supabase: SupabaseClient,
	throughDate: string
): Promise<LedgerEntry[]> {
	const entries: LedgerEntry[] = [];
	let pageStart = 0;
	while (true) {
		const page = await fetchEntriesPage(supabase, throughDate, pageStart);
		entries.push(...page);
		if (page.length < pageSize) return entries;
		pageStart += pageSize;
	}
}

async function fetchEntriesPage(
	supabase: SupabaseClient,
	throughDate: string,
	pageStart: number
): Promise<LedgerEntry[]> {
	const { data, error } = await supabase
		.from('ledger_entries')
		.select('*')
		.lte('journal_date', throughDate)
		.order('journal_date')
		.order('id')
		.range(pageStart, pageStart + pageSize - 1);
	if (error) throw error;
	return data.map(toLedgerEntry);
}

function toLedgerEntry(row: Record<string, any>): LedgerEntry {
	return {
		journalDate: row.journal_date,
		accountId: row.account_id,
		accountCode: row.account_code,
		accountName: row.account_name,
		accountType: row.account_type,
		costCentreId: row.cost_centre_id,
		debit: readMoney(row.debit),
		credit: readMoney(row.credit)
	};
}
