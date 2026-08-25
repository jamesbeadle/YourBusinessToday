import { roundToPence } from '$lib/data/accounting/money';
import type { LedgerAccountType } from '$lib/data/accounting/ledgerAccountTypes';
import type { LedgerEntry } from '../getLedgerEntries';
import { balancesByAccount, totalOf, type AccountBalance } from './accountBalances';

export type BalanceSheet = {
	asAt: string;
	assets: AccountBalance[];
	liabilities: AccountBalance[];
	equity: AccountBalance[];
	retainedEarnings: number;
	totalAssets: number;
	totalLiabilities: number;
	totalEquity: number;
	isBalanced: boolean;
};

export function buildBalanceSheet(entries: LedgerEntry[], asAt: string): BalanceSheet {
	const upToDate = entries.filter((entry) => entry.journalDate <= asAt);
	const assets = nonZeroBalancesOfType(upToDate, 'asset');
	const liabilities = nonZeroBalancesOfType(upToDate, 'liability');
	const equity = nonZeroBalancesOfType(upToDate, 'equity');
	const retainedEarnings = roundToPence(
		totalOf(balancesOfType(upToDate, 'income')) - totalOf(balancesOfType(upToDate, 'expense'))
	);
	const totalAssets = totalOf(assets);
	const totalLiabilities = totalOf(liabilities);
	const totalEquity = roundToPence(totalOf(equity) + retainedEarnings);
	return {
		asAt,
		assets,
		liabilities,
		equity,
		retainedEarnings,
		totalAssets,
		totalLiabilities,
		totalEquity,
		isBalanced: roundToPence(totalAssets - totalLiabilities - totalEquity) === 0
	};
}

export function balanceOfAccountCode(balances: AccountBalance[], accountCode: string): number {
	return balances.find((balance) => balance.accountCode === accountCode)?.balance ?? 0;
}

function balancesOfType(entries: LedgerEntry[], accountType: LedgerAccountType): AccountBalance[] {
	return balancesByAccount(entries.filter((entry) => entry.accountType === accountType));
}

function nonZeroBalancesOfType(
	entries: LedgerEntry[],
	accountType: LedgerAccountType
): AccountBalance[] {
	return balancesOfType(entries, accountType).filter((balance) => balance.balance !== 0);
}
