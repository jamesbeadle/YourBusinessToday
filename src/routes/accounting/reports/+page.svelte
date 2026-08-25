<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import BalanceSheetReport from '$lib/components/accounting/BalanceSheetReport.svelte';
	import ProfitAndLossReport from '$lib/components/accounting/ProfitAndLossReport.svelte';
	import ReportPeriodPicker from '$lib/components/accounting/ReportPeriodPicker.svelte';
	import { formatMonth } from '$lib/data/accounting/accountingPeriods';
	import { quietButtonClasses } from '$lib/components/accounting/accountingFormStyles';

	let { data } = $props();

	const reports = $derived(data.reports);
	const costCentreName = $derived(
		data.costCentres.find((costCentre) => costCentre.id === reports.costCentreId)?.name ?? null
	);
</script>

<svelte:head>
	<title>Reports — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Monthly accounts"
		description="Profit and loss for the month and financial year to date, and the balance sheet at month end."
	>
		{#snippet actions()}
			<button type="button" onclick={() => window.print()} class={quietButtonClasses}>Print</button>
		{/snippet}
	</AccountingPageHeader>
	<ReportPeriodPicker monthKey={reports.monthKey} costCentreId={reports.costCentreId} costCentres={data.costCentres} />
	<p class="hidden font-display text-2xl print:block">
		Management accounts — {formatMonth(reports.monthKey)}{costCentreName ? ` — ${costCentreName}` : ''}
	</p>
	<div class="grid gap-8 lg:grid-cols-2 print:grid-cols-1">
		<ProfitAndLossReport
			profitAndLoss={reports.profitAndLoss}
			monthKey={reports.monthKey}
			yearStart={reports.yearStart}
			{costCentreName}
		/>
		<BalanceSheetReport balanceSheet={reports.balanceSheet} isCostCentreFiltered={reports.costCentreId !== null} />
	</div>
</div>

<style>
	@media print {
		:global(body) {
			background: white;
			color: black;
		}
		:global(header),
		:global(footer),
		:global(nav) {
			display: none !important;
		}
	}
</style>
