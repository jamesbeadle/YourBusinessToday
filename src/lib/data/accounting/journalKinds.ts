export type JournalKind =
	| 'manual'
	| 'invoice'
	| 'invoice_void'
	| 'invoice_payment'
	| 'expense'
	| 'expense_payment'
	| 'accrual'
	| 'accrual_reversal'
	| 'prepayment_release';

export const journalKindLabels: Record<JournalKind, string> = {
	manual: 'Manual',
	invoice: 'Invoice',
	invoice_void: 'Invoice void',
	invoice_payment: 'Invoice payment',
	expense: 'Expense',
	expense_payment: 'Expense payment',
	accrual: 'Accrual',
	accrual_reversal: 'Accrual reversal',
	prepayment_release: 'Prepayment release'
};
