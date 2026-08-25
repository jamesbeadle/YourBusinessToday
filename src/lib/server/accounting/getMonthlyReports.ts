import type { SupabaseClient } from '@supabase/supabase-js';
import { financialYearStart, monthEnd, monthStart } from '$lib/data/accounting/accountingPeriods';
import { getAccountingSettings } from './getAccountingSettings';
import { getLedgerEntriesUpTo } from './getLedgerEntries';
import { buildBalanceSheet, type BalanceSheet } from './reports/buildBalanceSheet';
import { buildProfitAndLoss, type ProfitAndLoss } from './reports/buildProfitAndLoss';

export type MonthlyReports = {
	monthKey: string;
	costCentreId: string | null;
	yearStart: string;
	profitAndLoss: ProfitAndLoss;
	balanceSheet: BalanceSheet;
};

export async function getMonthlyReports(
	supabase: SupabaseClient,
	monthKey: string,
	costCentreId: string | null
): Promise<MonthlyReports> {
	const settings = await getAccountingSettings(supabase);
	const yearStart = financialYearStart(monthKey, settings.financialYearStartMonth);
	const entries = await getLedgerEntriesUpTo(supabase, monthEnd(monthKey));
	return {
		monthKey,
		costCentreId,
		yearStart,
		profitAndLoss: buildProfitAndLoss(entries, {
			periodStart: monthStart(monthKey),
			periodEnd: monthEnd(monthKey),
			yearStart,
			costCentreId
		}),
		balanceSheet: buildBalanceSheet(entries, monthEnd(monthKey))
	};
}
