import { roundToPence, sumMoney } from '$lib/data/accounting/money';
import type { LedgerEntry } from '../getLedgerEntries';
import { balancesByAccount } from './accountBalances';

export type ProfitAndLossLine = {
	accountCode: string;
	accountName: string;
	period: number;
	yearToDate: number;
};

export type ProfitAndLossTotals = { period: number; yearToDate: number };

export type ProfitAndLoss = {
	income: ProfitAndLossLine[];
	expenses: ProfitAndLossLine[];
	totalIncome: ProfitAndLossTotals;
	totalExpenses: ProfitAndLossTotals;
	netProfit: ProfitAndLossTotals;
};

export type ProfitAndLossWindow = {
	periodStart: string;
	periodEnd: string;
	yearStart: string;
	costCentreId: string | null;
};

export function buildProfitAndLoss(entries: LedgerEntry[], window: ProfitAndLossWindow): ProfitAndLoss {
	const relevant = entries.filter((entry) => isInCostCentre(entry, window.costCentreId));
	const income = linesOfType(relevant, 'income', window);
	const expenses = linesOfType(relevant, 'expense', window);
	const totalIncome = totalsOf(income);
	const totalExpenses = totalsOf(expenses);
	return {
		income,
		expenses,
		totalIncome,
		totalExpenses,
		netProfit: {
			period: roundToPence(totalIncome.period - totalExpenses.period),
			yearToDate: roundToPence(totalIncome.yearToDate - totalExpenses.yearToDate)
		}
	};
}

function linesOfType(
	entries: LedgerEntry[],
	accountType: 'income' | 'expense',
	window: ProfitAndLossWindow
): ProfitAndLossLine[] {
	const typed = entries.filter((entry) => entry.accountType === accountType);
	const periodBalances = balancesByAccount(
		typed.filter((entry) => isBetween(entry.journalDate, window.periodStart, window.periodEnd))
	);
	const yearBalances = balancesByAccount(
		typed.filter((entry) => isBetween(entry.journalDate, window.yearStart, window.periodEnd))
	);
	return yearBalances.map((yearBalance) => ({
		accountCode: yearBalance.accountCode,
		accountName: yearBalance.accountName,
		period:
			periodBalances.find((balance) => balance.accountId === yearBalance.accountId)?.balance ?? 0,
		yearToDate: yearBalance.balance
	}));
}

function totalsOf(lines: ProfitAndLossLine[]): ProfitAndLossTotals {
	return {
		period: sumMoney(lines.map((line) => line.period)),
		yearToDate: sumMoney(lines.map((line) => line.yearToDate))
	};
}

function isBetween(isoDate: string, start: string, end: string): boolean {
	return isoDate >= start && isoDate <= end;
}

function isInCostCentre(entry: LedgerEntry, costCentreId: string | null): boolean {
	return costCentreId === null || entry.costCentreId === costCentreId;
}
