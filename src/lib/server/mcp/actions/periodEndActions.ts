import { accountingAdminAction } from './accountingAdminAction';
import { costCentreIdField, monthKeyDescription, moneyField, wholeNumberField } from './accountingFields';
import { createAccrual } from '$lib/server/accounting/createAccrual';
import { createPrepaymentRelease } from '$lib/server/accounting/createPrepaymentRelease';
import { formDataFromInput } from './formDataFromInput';
import { formatMoney } from '$lib/data/accounting/money';
import { formatMonth } from '$lib/data/accounting/accountingPeriods';
import { objectSchema, textField } from '../actionTypes';
import { readAccrualForm, readPrepaymentReleaseForm } from '$lib/server/accounting/readPeriodEndForms';
import type { McpAction } from '../actionTypes';

const expenseAccountIdField = textField('The expense ledger account the cost belongs to');

export const periodEndActions: McpAction[] = [
	accountingAdminAction({
		name: 'create_accrual',
		isWrite: true,
		summary: 'accrue a cost incurred this month but not yet billed',
		guidance:
			'For a cost incurred this month but not yet billed. Posts the expense at month end and ' +
			'reverses it on the first of next month, so the real bill lands cleanly when it arrives.',
		inputSchema: objectSchema(
			{
				monthKey: textField(`The month the cost belongs to ${monthKeyDescription}`),
				description: textField('What the cost is for'),
				amount: moneyField('How much to accrue'),
				expenseAccountId: expenseAccountIdField,
				costCentreId: costCentreIdField
			},
			['monthKey', 'description', 'amount', 'expenseAccountId']
		),
		run: async (caller, input) => {
			const accrual = readAccrualForm(formDataFromInput(input));
			await createAccrual(caller.supabase, accrual);
			return `Accrual of ${formatMoney(accrual.amount)} for ${accrual.description} posted at the end of ${formatMonth(accrual.monthKey)}, with its reversal on the first of next month.`;
		}
	}),
	accountingAdminAction({
		name: 'create_prepayment_release',
		isWrite: true,
		summary: 'spread a cost paid up front across the months it covers',
		guidance:
			'For something paid up front that covers several months — record the payment as an ' +
			'expense against Prepayments first. Posts one journal per month moving a share into ' +
			'the expense account.',
		inputSchema: objectSchema(
			{
				firstMonthKey: textField(`The first month it covers ${monthKeyDescription}`),
				monthCount: wholeNumberField('How many months it covers'),
				totalAmount: moneyField('The whole amount paid up front'),
				description: textField('What the payment is for'),
				expenseAccountId: expenseAccountIdField,
				costCentreId: costCentreIdField
			},
			['firstMonthKey', 'monthCount', 'totalAmount', 'description', 'expenseAccountId']
		),
		run: async (caller, input) => {
			const release = readPrepaymentReleaseForm(formDataFromInput(input));
			await createPrepaymentRelease(caller.supabase, release);
			return `Prepayment release journals posted: ${formatMoney(release.totalAmount)} for ${release.description} over ${release.monthCount} month(s) from ${formatMonth(release.firstMonthKey)}.`;
		}
	})
];
