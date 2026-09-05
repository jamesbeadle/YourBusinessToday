import { accountingAdminAction } from './accountingAdminAction';
import { currentMonthKey } from '$lib/data/accounting/accountingPeriods';
import { describeBalanceSheet } from './describeBalanceSheet';
import { describeProfitAndLoss } from './describeProfitAndLoss';
import { getCostCentres } from '$lib/server/accounting/getCostCentres';
import { getMonthlyReports } from '$lib/server/accounting/getMonthlyReports';
import { monthKeyDescription } from './accountingFields';
import { objectSchema, readOptionalText, textField } from '../actionTypes';
import type { CostCentre } from '$lib/server/accounting/getCostCentres';
import type { McpAction } from '../actionTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

type ReportScope = CostCentre | null;

const monthKeyPattern = /^\d{4}-\d{2}$/;

const wrongMonth = `Give the month ${monthKeyDescription}, or leave it out for the current month.`;

const noSuchCostCentre = 'No cost centre has that id. Call list_cost_centres to see them.';

const monthKeyField = textField(`The month to report ${monthKeyDescription} — defaults to this month`);

export const reportActions: McpAction[] = [
	accountingAdminAction({
		name: 'read_profit_and_loss',
		isWrite: false,
		summary: 'read the profit and loss for a month, with year to date figures',
		inputSchema: objectSchema({
			monthKey: monthKeyField,
			costCentreId: textField('Only income and costs tagged with this cost centre — leave out for all')
		}),
		run: async (caller, input) => {
			const monthKey = readMonthKey(input);
			if (monthKey === null) return wrongMonth;
			const scope = await resolveScope(caller.supabase, readOptionalText(input, 'costCentreId'));
			if (typeof scope === 'string') return scope;
			const reports = await getMonthlyReports(caller.supabase, monthKey, scope?.id ?? null);
			return describeProfitAndLoss(reports.profitAndLoss, monthKey, reports.yearStart, scope);
		}
	}),
	accountingAdminAction({
		name: 'read_balance_sheet',
		isWrite: false,
		summary: 'read the balance sheet as at the end of a month',
		inputSchema: objectSchema({ monthKey: monthKeyField }),
		run: async (caller, input) => {
			const monthKey = readMonthKey(input);
			if (monthKey === null) return wrongMonth;
			const reports = await getMonthlyReports(caller.supabase, monthKey, null);
			return describeBalanceSheet(reports.balanceSheet);
		}
	})
];

function readMonthKey(input: Record<string, unknown>): string | null {
	const requested = readOptionalText(input, 'monthKey');
	if (requested === null) return currentMonthKey();
	if (monthKeyPattern.test(requested)) return requested;
	return null;
}

async function resolveScope(
	supabase: SupabaseClient,
	costCentreId: string | null
): Promise<ReportScope | string> {
	if (costCentreId === null) return null;
	const costCentres = await getCostCentres(supabase);
	return costCentres.find((costCentre) => costCentre.id === costCentreId) ?? noSuchCostCentre;
}
