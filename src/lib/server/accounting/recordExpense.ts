import type { SupabaseClient } from '@supabase/supabase-js';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { findSystemAccountId } from './findSystemAccount';
import { creditLine, debitLine } from './journalLines';
import { postJournal } from './postJournal';

export type ExpenseInput = {
	expenseDate: string;
	supplier: string;
	description: string;
	amount: number;
	expenseAccountId: string;
	costCentreId: string | null;
	isPaid: boolean;
};

export async function recordExpense(supabase: SupabaseClient, expense: ExpenseInput): Promise<void> {
	const settledFromCode = expense.isPaid ? SystemAccountCodes.Bank : SystemAccountCodes.TradeCreditors;
	const settledFromAccountId = await findSystemAccountId(supabase, settledFromCode);
	const journalId = await postJournal(supabase, {
		journalDate: expense.expenseDate,
		description: expenseDescription(expense),
		kind: 'expense',
		lines: [
			debitLine(expense.expenseAccountId, expense.amount, expense.costCentreId),
			creditLine(settledFromAccountId, expense.amount)
		]
	});
	const { error } = await supabase.from('expenses').insert({
		expense_date: expense.expenseDate,
		supplier: expense.supplier,
		description: expense.description,
		amount: expense.amount,
		expense_account_id: expense.expenseAccountId,
		cost_centre_id: expense.costCentreId,
		paid_on: expense.isPaid ? expense.expenseDate : null,
		recorded_journal_id: journalId
	});
	if (error) throw error;
}

export function expenseDescription(expense: { supplier: string; description: string }): string {
	if (expense.description === '') return expense.supplier;
	return `${expense.supplier} — ${expense.description}`;
}
