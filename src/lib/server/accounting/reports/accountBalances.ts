import { isDebitNormal } from '$lib/data/accounting/ledgerAccountTypes';
import { roundToPence } from '$lib/data/accounting/money';
import type { LedgerEntry } from '../getLedgerEntries';

export type AccountBalance = {
	accountId: string;
	accountCode: string;
	accountName: string;
	balance: number;
};

export function balancesByAccount(entries: LedgerEntry[]): AccountBalance[] {
	const balances = new Map<string, AccountBalance>();
	for (const entry of entries) {
		const balance = balances.get(entry.accountId) ?? emptyBalance(entry);
		balance.balance = roundToPence(balance.balance + naturalAmount(entry));
		balances.set(entry.accountId, balance);
	}
	return [...balances.values()].sort((first, second) =>
		first.accountCode.localeCompare(second.accountCode)
	);
}

export function totalOf(balances: AccountBalance[]): number {
	return roundToPence(balances.reduce((total, balance) => total + balance.balance, 0));
}

function naturalAmount(entry: LedgerEntry): number {
	if (isDebitNormal(entry.accountType)) return entry.debit - entry.credit;
	return entry.credit - entry.debit;
}

function emptyBalance(entry: LedgerEntry): AccountBalance {
	return {
		accountId: entry.accountId,
		accountCode: entry.accountCode,
		accountName: entry.accountName,
		balance: 0
	};
}
