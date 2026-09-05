import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney } from '$lib/data/accounting/money';
import { formatMonth } from '$lib/data/accounting/accountingPeriods';
import type { CostCentre } from '$lib/server/accounting/getCostCentres';
import type {
	ProfitAndLoss,
	ProfitAndLossLine,
	ProfitAndLossTotals
} from '$lib/server/accounting/reports/buildProfitAndLoss';

export function describeProfitAndLoss(
	profitAndLoss: ProfitAndLoss,
	monthKey: string,
	yearStart: string,
	costCentre: CostCentre | null
): string {
	const scope = costCentre === null ? '' : ` — cost centre ${costCentre.name}`;
	return [
		`Profit and loss for ${formatMonth(monthKey)}, year to date from ${formatBritishDate(yearStart)}${scope}`,
		'',
		'Income:',
		...describeLines(profitAndLoss.income),
		`Total income — ${describeTotals(profitAndLoss.totalIncome)}`,
		'',
		'Expenses:',
		...describeLines(profitAndLoss.expenses),
		`Total expenses — ${describeTotals(profitAndLoss.totalExpenses)}`,
		'',
		`Net profit — ${describeTotals(profitAndLoss.netProfit)}`
	].join('\n');
}

export function describeTotals(totals: ProfitAndLossTotals): string {
	return `${formatMoney(totals.period)} this month, ${formatMoney(totals.yearToDate)} year to date`;
}

function describeLines(lines: ProfitAndLossLine[]): string[] {
	if (lines.length === 0) return ['Nothing posted this year.'];
	return lines.map((line) => `${line.accountCode} ${line.accountName} — ${describeTotals(line)}`);
}
