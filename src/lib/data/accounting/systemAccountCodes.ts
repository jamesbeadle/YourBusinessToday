export const SystemAccountCodes = {
	TradeDebtors: '1100',
	Bank: '1200',
	Prepayments: '1300',
	TradeCreditors: '2100',
	Accruals: '2200',
	Sales: '4000'
} as const;

export type SystemAccountCode = (typeof SystemAccountCodes)[keyof typeof SystemAccountCodes];
