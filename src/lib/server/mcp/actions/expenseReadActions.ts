import { accountingAdminAction } from './accountingAdminAction';
import { describeExpenseSummary } from './describeExpense';
import { formatMoney, sumMoney } from '$lib/data/accounting/money';
import { getExpenses } from '$lib/server/accounting/getExpenses';
import { objectSchema } from '../actionTypes';
import type { ExpenseSummary } from '$lib/server/accounting/getExpenses';
import type { McpAction } from '../actionTypes';

export const expenseReadActions: McpAction[] = [
	accountingAdminAction({
		name: 'list_expenses',
		isWrite: false,
		summary: 'list expenses, newest first, showing which are still unpaid',
		inputSchema: objectSchema({
			shouldShowOnlyUnpaid: { type: 'boolean', description: 'Only expenses not yet paid' }
		}),
		run: async (caller, input) => {
			const expenses = await getExpenses(caller.supabase);
			const shown = input.shouldShowOnlyUnpaid === true ? unpaidOnly(expenses) : expenses;
			if (shown.length === 0) return 'No expenses match.';
			return [describeUnpaidTotal(shown), ...shown.map(describeExpenseSummary)].join('\n');
		}
	})
];

function unpaidOnly(expenses: ExpenseSummary[]): ExpenseSummary[] {
	return expenses.filter((expense) => expense.paidOn === null);
}

function describeUnpaidTotal(expenses: ExpenseSummary[]): string {
	const unpaid = unpaidOnly(expenses);
	const owed = sumMoney(unpaid.map((expense) => expense.amount));
	return `${expenses.length} expense(s), ${unpaid.length} unpaid totalling ${formatMoney(owed)}.`;
}
