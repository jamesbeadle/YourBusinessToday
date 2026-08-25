import type { SupabaseClient } from '@supabase/supabase-js';
import { formatMonth, monthEnd, shiftMonth } from '$lib/data/accounting/accountingPeriods';
import { roundToPence } from '$lib/data/accounting/money';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { AccountingError } from './accountingErrors';
import { findSystemAccountId } from './findSystemAccount';
import { creditLine, debitLine } from './journalLines';
import { postJournal } from './postJournal';

export type PrepaymentReleaseInput = {
	firstMonthKey: string;
	monthCount: number;
	totalAmount: number;
	description: string;
	expenseAccountId: string;
	costCentreId: string | null;
};

const maximumReleaseMonths = 36;

export async function createPrepaymentRelease(
	supabase: SupabaseClient,
	release: PrepaymentReleaseInput
): Promise<void> {
	if (release.monthCount < 1 || release.monthCount > maximumReleaseMonths) {
		throw new AccountingError(`Release over 1 to ${maximumReleaseMonths} months.`);
	}
	const prepaymentsAccountId = await findSystemAccountId(supabase, SystemAccountCodes.Prepayments);
	for (const [monthIndex, amount] of monthlyAmounts(release).entries()) {
		const monthKey = shiftMonth(release.firstMonthKey, monthIndex);
		await postJournal(supabase, {
			journalDate: monthEnd(monthKey),
			description: `Prepayment release — ${release.description} (${formatMonth(monthKey)})`,
			kind: 'prepayment_release',
			lines: [
				debitLine(release.expenseAccountId, amount, release.costCentreId),
				creditLine(prepaymentsAccountId, amount)
			]
		});
	}
}

function monthlyAmounts(release: PrepaymentReleaseInput): number[] {
	const evenShare = roundToPence(release.totalAmount / release.monthCount);
	const allButLast = Array.from({ length: release.monthCount - 1 }, () => evenShare);
	const lastShare = roundToPence(release.totalAmount - evenShare * (release.monthCount - 1));
	return [...allButLast, lastShare];
}
