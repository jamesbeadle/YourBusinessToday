import type { SupabaseClient } from '@supabase/supabase-js';
import { readMoney } from './readNumeric';

export type ExpenseSummary = {
	id: string;
	expenseDate: string;
	supplier: string;
	description: string;
	amount: number;
	accountName: string;
	costCentreName: string | null;
	paidOn: string | null;
	recordedJournalId: string | null;
	paymentJournalId: string | null;
};

const expenseColumns = '*, ledger_accounts (name), cost_centres (name)';

export async function getExpenses(supabase: SupabaseClient): Promise<ExpenseSummary[]> {
	const { data, error } = await supabase
		.from('expenses')
		.select(expenseColumns)
		.order('expense_date', { ascending: false });
	if (error) throw error;
	return data.map(toExpenseSummary);
}

export async function getExpense(supabase: SupabaseClient, expenseId: string): Promise<ExpenseSummary | null> {
	const { data, error } = await supabase
		.from('expenses')
		.select(expenseColumns)
		.eq('id', expenseId)
		.maybeSingle();
	if (error) throw error;
	return data === null ? null : toExpenseSummary(data);
}

function toExpenseSummary(row: Record<string, any>): ExpenseSummary {
	return {
		id: row.id,
		expenseDate: row.expense_date,
		supplier: row.supplier,
		description: row.description,
		amount: readMoney(row.amount),
		accountName: row.ledger_accounts?.name ?? '',
		costCentreName: row.cost_centres?.name ?? null,
		paidOn: row.paid_on,
		recordedJournalId: row.recorded_journal_id,
		paymentJournalId: row.payment_journal_id
	};
}
