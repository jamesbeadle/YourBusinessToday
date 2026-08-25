import type { SupabaseClient } from '@supabase/supabase-js';
import { monthEnd, monthStart, shiftMonth } from '$lib/data/accounting/accountingPeriods';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { findSystemAccountId } from './findSystemAccount';
import { creditLine, debitLine } from './journalLines';
import { postJournal } from './postJournal';

export type AccrualInput = {
	monthKey: string;
	description: string;
	amount: number;
	expenseAccountId: string;
	costCentreId: string | null;
};

export async function createAccrual(supabase: SupabaseClient, accrual: AccrualInput): Promise<void> {
	const accrualsAccountId = await findSystemAccountId(supabase, SystemAccountCodes.Accruals);
	const accrualJournalId = await postJournal(supabase, {
		journalDate: monthEnd(accrual.monthKey),
		description: `Accrual — ${accrual.description}`,
		kind: 'accrual',
		lines: [
			debitLine(accrual.expenseAccountId, accrual.amount, accrual.costCentreId),
			creditLine(accrualsAccountId, accrual.amount)
		]
	});
	await postJournal(supabase, {
		journalDate: monthStart(shiftMonth(accrual.monthKey, 1)),
		description: `Reversal of accrual — ${accrual.description}`,
		kind: 'accrual_reversal',
		reversesJournalId: accrualJournalId,
		lines: [
			debitLine(accrualsAccountId, accrual.amount),
			creditLine(accrual.expenseAccountId, accrual.amount, accrual.costCentreId)
		]
	});
}
