import type { SupabaseClient } from '@supabase/supabase-js';
import type { JournalLineInput } from './postJournal';
import { readMoney } from './readNumeric';

export async function getJournalLines(
	supabase: SupabaseClient,
	journalId: string
): Promise<JournalLineInput[]> {
	const { data, error } = await supabase
		.from('journal_lines')
		.select('account_id, cost_centre_id, debit, credit')
		.eq('journal_id', journalId)
		.order('position');
	if (error) throw error;
	return data.map((row) => ({
		accountId: row.account_id,
		costCentreId: row.cost_centre_id,
		debit: readMoney(row.debit),
		credit: readMoney(row.credit)
	}));
}

export async function deleteJournals(
	supabase: SupabaseClient,
	journalIds: (string | null)[]
): Promise<void> {
	const existingIds = journalIds.filter((journalId): journalId is string => journalId !== null);
	if (existingIds.length === 0) return;
	const { error } = await supabase.from('journals').delete().in('id', existingIds);
	if (error) throw error;
}
