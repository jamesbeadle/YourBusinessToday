import type { SupabaseClient } from '@supabase/supabase-js';
import {
	currentMonthKey,
	financialYearStart,
	monthEnd,
	monthStart
} from '$lib/data/accounting/accountingPeriods';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { isInvoiceOutstanding } from '$lib/data/accounting/invoiceStatus';
import { getAccountingSettings } from './getAccountingSettings';
import { getInvoiceList, type InvoiceSummary } from './getInvoiceList';
import { getLedgerEntriesUpTo } from './getLedgerEntries';
import { balanceOfAccountCode, buildBalanceSheet } from './reports/buildBalanceSheet';
import { buildProfitAndLoss, type ProfitAndLoss } from './reports/buildProfitAndLoss';

export type AccountingOverview = {
	monthKey: string;
	profitAndLoss: ProfitAndLoss;
	bankBalance: number;
	debtors: number;
	creditors: number;
	outstandingInvoices: InvoiceSummary[];
};

export async function getAccountingOverview(supabase: SupabaseClient): Promise<AccountingOverview> {
	const monthKey = currentMonthKey();
	const settings = await getAccountingSettings(supabase);
	const entries = await getLedgerEntriesUpTo(supabase, monthEnd(monthKey));
	const balanceSheet = buildBalanceSheet(entries, monthEnd(monthKey));
	const invoices = await getInvoiceList(supabase);
	return {
		monthKey,
		profitAndLoss: buildProfitAndLoss(entries, {
			periodStart: monthStart(monthKey),
			periodEnd: monthEnd(monthKey),
			yearStart: financialYearStart(monthKey, settings.financialYearStartMonth),
			costCentreId: null
		}),
		bankBalance: balanceOfAccountCode(balanceSheet.assets, SystemAccountCodes.Bank),
		debtors: balanceOfAccountCode(balanceSheet.assets, SystemAccountCodes.TradeDebtors),
		creditors: balanceOfAccountCode(balanceSheet.liabilities, SystemAccountCodes.TradeCreditors),
		outstandingInvoices: invoices.filter((invoice) => isInvoiceOutstanding(invoice.status))
	};
}
