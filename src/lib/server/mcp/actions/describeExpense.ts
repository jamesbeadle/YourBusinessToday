import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney } from '$lib/data/accounting/money';
import type { ExpenseSummary } from '$lib/server/accounting/getExpenses';

export const noSuchExpense = 'No expense has that id. Call list_expenses to see them.';

export function describeExpenseSummary(expense: ExpenseSummary): string {
	return [
		formatBritishDate(expense.expenseDate),
		describeSupplier(expense),
		formatMoney(expense.amount),
		describeAccount(expense),
		describeSettlement(expense)
	].join(' — ') + ` (id: ${expense.id})`;
}

export function describeSupplier(expense: { supplier: string; description: string }): string {
	if (expense.description === '') return expense.supplier;
	return `${expense.supplier}, ${expense.description}`;
}

function describeAccount(expense: ExpenseSummary): string {
	if (expense.costCentreName === null) return expense.accountName;
	return `${expense.accountName} (${expense.costCentreName})`;
}

function describeSettlement(expense: ExpenseSummary): string {
	if (expense.paidOn === null) return 'unpaid';
	return `paid ${formatBritishDate(expense.paidOn)}`;
}
