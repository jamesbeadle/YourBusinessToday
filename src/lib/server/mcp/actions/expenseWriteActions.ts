import { accountingAdminAction } from './accountingAdminAction';
import { costCentreIdField, expenseIdField, isoDateDescription, moneyField } from './accountingFields';
import { deleteExpense, payExpense } from '$lib/server/accounting/payExpense';
import { describeSupplier, noSuchExpense } from './describeExpense';
import { formDataFromInput } from './formDataFromInput';
import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney } from '$lib/data/accounting/money';
import { getExpense } from '$lib/server/accounting/getExpenses';
import { objectSchema, readText, textField } from '../actionTypes';
import { readDateField } from '$lib/server/accounting/readFormValues';
import { readExpenseForm } from '$lib/server/accounting/readExpenseForm';
import { recordExpense } from '$lib/server/accounting/recordExpense';
import type { ExpenseInput } from '$lib/server/accounting/recordExpense';
import type { McpAction } from '../actionTypes';

export const expenseWriteActions: McpAction[] = [
	accountingAdminAction({
		name: 'record_expense',
		isWrite: true,
		summary: 'record a cost from a supplier, posting it to the ledger',
		guidance:
			'Recording posts the cost straight away: against the bank when it is already paid, ' +
			'otherwise against trade creditors until pay_expense settles it. Something paid up ' +
			'front for several months goes against Prepayments, then create_prepayment_release ' +
			'spreads it.',
		inputSchema: objectSchema(
			{
				expenseDate: textField(`The date of the cost ${isoDateDescription}`),
				supplier: textField('Who was paid'),
				description: textField('What it was for'),
				amount: moneyField('How much'),
				expenseAccountId: textField('The expense ledger account it posts to'),
				costCentreId: costCentreIdField,
				isPaid: { type: 'boolean', description: 'True when it has already been paid' }
			},
			['expenseDate', 'supplier', 'amount', 'expenseAccountId']
		),
		run: async (caller, input) => {
			const expense = readExpenseForm(formDataFromInput(input));
			await recordExpense(caller.supabase, expense);
			return `Expense recorded and posted to the ledger: ${describeRecorded(expense)}.`;
		}
	}),
	accountingAdminAction({
		name: 'pay_expense',
		isWrite: true,
		summary: 'mark an unpaid expense as paid from the bank',
		inputSchema: objectSchema(
			{ expenseId: expenseIdField, paidOn: textField(`The date it was paid ${isoDateDescription}`) },
			['expenseId', 'paidOn']
		),
		run: async (caller, input) => {
			const expense = await getExpense(caller.supabase, readText(input, 'expenseId'));
			if (expense === null) return noSuchExpense;
			const paidOn = readDateField(formDataFromInput(input), 'paidOn', 'Payment date');
			await payExpense(caller.supabase, { expenseId: expense.id, paidOn });
			return `${describeSupplier(expense)} marked as paid on ${formatBritishDate(paidOn)}.`;
		}
	}),
	accountingAdminAction({
		name: 'delete_expense',
		isWrite: true,
		summary: 'delete an expense along with its ledger entries',
		guidance:
			'This removes the expense and the journals it posted, as the site does — use it for a ' +
			'mistaken entry, not for a cost that was real.',
		inputSchema: objectSchema({ expenseId: expenseIdField }, ['expenseId']),
		run: async (caller, input) => {
			const expense = await getExpense(caller.supabase, readText(input, 'expenseId'));
			if (expense === null) return noSuchExpense;
			await deleteExpense(caller.supabase, expense.id);
			return `${describeSupplier(expense)} deleted along with its ledger entries.`;
		}
	})
];

function describeRecorded(expense: ExpenseInput): string {
	const settlement = expense.isPaid ? 'paid from the bank' : 'owed to the supplier';
	return `${describeSupplier(expense)}, ${formatMoney(expense.amount)} on ${formatBritishDate(expense.expenseDate)}, ${settlement}`;
}
