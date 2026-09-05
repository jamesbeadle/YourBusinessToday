import { accountingAdminAction } from './accountingAdminAction';
import { describeInvoiceSummary, outstandingOn } from './describeInvoice';
import { describeTotals } from './describeProfitAndLoss';
import { formatMoney, sumMoney } from '$lib/data/accounting/money';
import { formatMonth } from '$lib/data/accounting/accountingPeriods';
import { getAccountingOverview } from '$lib/server/accounting/getAccountingOverview';
import { objectSchema } from '../actionTypes';
import type { AccountingOverview } from '$lib/server/accounting/getAccountingOverview';
import type { InvoiceSummary } from '$lib/server/accounting/getInvoiceList';
import type { McpAction } from '../actionTypes';

export const overviewActions: McpAction[] = [
	accountingAdminAction({
		name: 'read_accounting_overview',
		isWrite: false,
		summary: 'read the accounting front page: bank, debtors, creditors, this month and unpaid invoices',
		inputSchema: objectSchema({}),
		run: async (caller) => describeOverview(await getAccountingOverview(caller.supabase))
	})
];

function describeOverview(overview: AccountingOverview): string {
	return [
		`Accounting overview for ${formatMonth(overview.monthKey)}`,
		`Bank ${formatMoney(overview.bankBalance)}`,
		`Owed by clients ${formatMoney(overview.debtors)}`,
		`Owed to suppliers ${formatMoney(overview.creditors)}`,
		'',
		`Income — ${describeTotals(overview.profitAndLoss.totalIncome)}`,
		`Expenses — ${describeTotals(overview.profitAndLoss.totalExpenses)}`,
		`Net profit — ${describeTotals(overview.profitAndLoss.netProfit)}`,
		'',
		...describeOutstandingInvoices(overview.outstandingInvoices)
	].join('\n');
}

function describeOutstandingInvoices(invoices: InvoiceSummary[]): string[] {
	if (invoices.length === 0) return ['No invoices are outstanding.'];
	const owed = formatMoney(sumMoney(invoices.map(outstandingOn)));
	return [
		`Outstanding invoices — ${invoices.length}, ${owed} in total:`,
		...invoices.map(describeInvoiceSummary)
	];
}
