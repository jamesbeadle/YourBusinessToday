import type { SupabaseClient } from '@supabase/supabase-js';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { AccountingError } from './accountingErrors';
import { findSystemAccountId } from './findSystemAccount';
import { getExpense } from './getExpenses';
import { deleteJournals } from './getJournalLines';
import { creditLine, debitLine } from './journalLines';
import { postJournal } from './postJournal';
import { expenseDescription } from './recordExpense';

export async function payExpense(
	supabase: SupabaseClient,
	payment: { expenseId: string; paidOn: string }
): Promise<void> {
	const expense = await getExpense(supabase, payment.expenseId);
	if (expense === null) throw new AccountingError('That expense no longer exists.');
	if (expense.paidOn !== null) throw new AccountingError('This expense is already paid.');
	const journalId = await postJournal(supabase, {
		journalDate: payment.paidOn,
		description: `Paid ${expenseDescription(expense)}`,
		kind: 'expense_payment',
		lines: [
			debitLine(await findSystemAccountId(supabase, SystemAccountCodes.TradeCreditors), expense.amount),
			creditLine(await findSystemAccountId(supabase, SystemAccountCodes.Bank), expense.amount)
		]
	});
	const { error } = await supabase
		.from('expenses')
		.update({ paid_on: payment.paidOn, payment_journal_id: journalId })
		.eq('id', payment.expenseId);
	if (error) throw error;
}

export async function deleteExpense(supabase: SupabaseClient, expenseId: string): Promise<void> {
	const expense = await getExpense(supabase, expenseId);
	if (expense === null) return;
	const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
	if (error) throw error;
	await deleteJournals(supabase, [expense.recordedJournalId, expense.paymentJournalId]);
}
