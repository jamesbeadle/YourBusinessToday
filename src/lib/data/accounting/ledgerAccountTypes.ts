export type LedgerAccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export const ledgerAccountTypeOrder: LedgerAccountType[] = [
	'asset',
	'liability',
	'equity',
	'income',
	'expense'
];

export const ledgerAccountTypeLabels: Record<LedgerAccountType, string> = {
	asset: 'Asset',
	liability: 'Liability',
	equity: 'Equity',
	income: 'Income',
	expense: 'Expense'
};

const debitNormalTypes: LedgerAccountType[] = ['asset', 'expense'];

export function isDebitNormal(accountType: LedgerAccountType): boolean {
	return debitNormalTypes.includes(accountType);
}

export function isProfitAndLossType(accountType: LedgerAccountType): boolean {
	return accountType === 'income' || accountType === 'expense';
}
