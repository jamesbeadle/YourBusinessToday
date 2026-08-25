import type { SupabaseClient } from '@supabase/supabase-js';
import type { JournalKind } from '$lib/data/accounting/journalKinds';
import { sumMoney } from '$lib/data/accounting/money';
import { readMoney } from './readNumeric';

export type JournalLineSummary = {
	accountCode: string;
	accountName: string;
	costCentreName: string | null;
	debit: number;
	credit: number;
};

export type JournalSummary = {
	id: string;
	journalDate: string;
	description: string;
	kind: JournalKind;
	total: number;
	lines: JournalLineSummary[];
};

const journalColumns =
	'id, journal_date, description, kind, journal_lines (position, debit, credit, ledger_accounts (code, name), cost_centres (name))';
const recentJournalLimit = 200;

export async function getJournalList(supabase: SupabaseClient): Promise<JournalSummary[]> {
	const { data, error } = await supabase
		.from('journals')
		.select(journalColumns)
		.order('journal_date', { ascending: false })
		.order('created_at', { ascending: false })
		.limit(recentJournalLimit);
	if (error) throw error;
	return data.map(toJournalSummary);
}

function toJournalSummary(row: Record<string, any>): JournalSummary {
	const lines = [...(row.journal_lines ?? [])]
		.sort((first, second) => first.position - second.position)
		.map(toLineSummary);
	return {
		id: row.id,
		journalDate: row.journal_date,
		description: row.description,
		kind: row.kind,
		total: sumMoney(lines.map((line) => line.debit)),
		lines
	};
}

function toLineSummary(row: Record<string, any>): JournalLineSummary {
	return {
		accountCode: row.ledger_accounts?.code ?? '',
		accountName: row.ledger_accounts?.name ?? '',
		costCentreName: row.cost_centres?.name ?? null,
		debit: readMoney(row.debit),
		credit: readMoney(row.credit)
	};
}
