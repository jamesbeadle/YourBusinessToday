<script lang="ts">
	import ReportRow from './ReportRow.svelte';
	import ReportTable from './ReportTable.svelte';
	import { formatIsoDate, formatMonth, monthEnd } from '$lib/data/accounting/accountingPeriods';
	import type { ProfitAndLoss } from '$lib/server/accounting/reports/buildProfitAndLoss';

	let {
		profitAndLoss,
		monthKey,
		yearStart,
		costCentreName
	}: {
		profitAndLoss: ProfitAndLoss;
		monthKey: string;
		yearStart: string;
		costCentreName: string | null;
	} = $props();

	const subtitle = $derived(
		`${costCentreName ?? 'Whole business'} — year to date from ${formatIsoDate(yearStart)} to ${formatIsoDate(monthEnd(monthKey))}`
	);
</script>

<ReportTable title="Profit and loss" {subtitle} columnHeadings={[formatMonth(monthKey), 'Year to date']}>
	<ReportRow label="Income" amounts={[]} emphasis="heading" />
	{#each profitAndLoss.income as line (line.accountCode)}
		<ReportRow label={`${line.accountCode} ${line.accountName}`} amounts={[line.period, line.yearToDate]} />
	{/each}
	<ReportRow
		label="Total income"
		amounts={[profitAndLoss.totalIncome.period, profitAndLoss.totalIncome.yearToDate]}
		emphasis="total"
	/>
	<ReportRow label="Expenses" amounts={[]} emphasis="heading" />
	{#each profitAndLoss.expenses as line (line.accountCode)}
		<ReportRow label={`${line.accountCode} ${line.accountName}`} amounts={[line.period, line.yearToDate]} />
	{/each}
	<ReportRow
		label="Total expenses"
		amounts={[profitAndLoss.totalExpenses.period, profitAndLoss.totalExpenses.yearToDate]}
		emphasis="total"
	/>
	<ReportRow
		label="Net profit"
		amounts={[profitAndLoss.netProfit.period, profitAndLoss.netProfit.yearToDate]}
		emphasis="grand"
	/>
</ReportTable>
