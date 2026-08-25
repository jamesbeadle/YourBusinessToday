import type { SupabaseClient } from '@supabase/supabase-js';
import type { JournalKind } from '$lib/data/accounting/journalKinds';
import { roundToPence, sumMoney } from '$lib/data/accounting/money';
import { AccountingError } from './accountingErrors';

export type JournalLineInput = {
	accountId: string;
	costCentreId: string | null;
	debit: number;
	credit: number;
};

export type JournalInput = {
	journalDate: string;
	description: string;
	kind: JournalKind;
	reversesJournalId?: string | null;
	lines: JournalLineInput[];
};

const minimumLineCount = 2;

export async function postJournal(supabase: SupabaseClient, journal: JournalInput): Promise<string> {
	assertJournalBalances(journal.lines);
	const journalId = await insertJournal(supabase, journal);
	const { error } = await supabase
		.from('journal_lines')
		.insert(journal.lines.map((line, position) => toLineRow(journalId, line, position)));
	if (error) {
		await supabase.from('journals').delete().eq('id', journalId);
		throw error;
	}
	return journalId;
}

export function assertJournalBalances(lines: JournalLineInput[]): void {
	if (lines.length < minimumLineCount) {
		throw new AccountingError('A journal needs at least two lines.');
	}
	const totalDebit = sumMoney(lines.map((line) => line.debit));
	const totalCredit = sumMoney(lines.map((line) => line.credit));
	if (totalDebit !== totalCredit) {
		throw new AccountingError(`Debits (${totalDebit}) do not equal credits (${totalCredit}).`);
	}
	if (totalDebit === 0) throw new AccountingError('A journal must move some money.');
}

async function insertJournal(supabase: SupabaseClient, journal: JournalInput): Promise<string> {
	const { data, error } = await supabase
		.from('journals')
		.insert({
			journal_date: journal.journalDate,
			description: journal.description,
			kind: journal.kind,
			reverses_journal_id: journal.reversesJournalId ?? null
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

function toLineRow(journalId: string, line: JournalLineInput, position: number) {
	return {
		journal_id: journalId,
		account_id: line.accountId,
		cost_centre_id: line.costCentreId,
		debit: roundToPence(line.debit),
		credit: roundToPence(line.credit),
		position
	};
}
