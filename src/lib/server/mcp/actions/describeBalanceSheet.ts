import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney } from '$lib/data/accounting/money';
import type { AccountBalance } from '$lib/server/accounting/reports/accountBalances';
import type { BalanceSheet } from '$lib/server/accounting/reports/buildBalanceSheet';

export function describeBalanceSheet(balanceSheet: BalanceSheet): string {
	return [
		`Balance sheet as at ${formatBritishDate(balanceSheet.asAt)}`,
		'',
		'Assets:',
		...describeBalances(balanceSheet.assets),
		`Total assets ${formatMoney(balanceSheet.totalAssets)}`,
		'',
		'Liabilities:',
		...describeBalances(balanceSheet.liabilities),
		`Total liabilities ${formatMoney(balanceSheet.totalLiabilities)}`,
		'',
		'Equity:',
		...describeBalances(balanceSheet.equity),
		`Retained earnings ${formatMoney(balanceSheet.retainedEarnings)}`,
		`Total equity ${formatMoney(balanceSheet.totalEquity)}`,
		'',
		describeBalancing(balanceSheet.isBalanced)
	].join('\n');
}

function describeBalances(balances: AccountBalance[]): string[] {
	if (balances.length === 0) return ['None.'];
	return balances.map(
		(balance) => `${balance.accountCode} ${balance.accountName} — ${formatMoney(balance.balance)}`
	);
}

function describeBalancing(isBalanced: boolean): string {
	if (isBalanced) return 'The sheet balances.';
	return 'The sheet does not balance — assets differ from liabilities plus equity.';
}
