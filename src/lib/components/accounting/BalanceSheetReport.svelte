<script lang="ts">
	import ReportRow from './ReportRow.svelte';
	import ReportTable from './ReportTable.svelte';
	import { formatIsoDate } from '$lib/data/accounting/accountingPeriods';
	import type { BalanceSheet } from '$lib/server/accounting/reports/buildBalanceSheet';

	let { balanceSheet, isCostCentreFiltered }: { balanceSheet: BalanceSheet; isCostCentreFiltered: boolean } =
		$props();

	const subtitle = $derived(
		isCostCentreFiltered
			? `Whole business as at ${formatIsoDate(balanceSheet.asAt)} — the balance sheet is not split by cost centre`
			: `As at ${formatIsoDate(balanceSheet.asAt)}`
	);
</script>

<ReportTable title="Balance sheet" {subtitle} columnHeadings={['Balance']}>
	<ReportRow label="Assets" amounts={[]} emphasis="heading" />
	{#each balanceSheet.assets as line (line.accountId)}
		<ReportRow label={`${line.accountCode} ${line.accountName}`} amounts={[line.balance]} />
	{/each}
	<ReportRow label="Total assets" amounts={[balanceSheet.totalAssets]} emphasis="total" />
	<ReportRow label="Liabilities" amounts={[]} emphasis="heading" />
	{#each balanceSheet.liabilities as line (line.accountId)}
		<ReportRow label={`${line.accountCode} ${line.accountName}`} amounts={[line.balance]} />
	{/each}
	<ReportRow label="Total liabilities" amounts={[balanceSheet.totalLiabilities]} emphasis="total" />
	<ReportRow label="Equity" amounts={[]} emphasis="heading" />
	{#each balanceSheet.equity as line (line.accountId)}
		<ReportRow label={`${line.accountCode} ${line.accountName}`} amounts={[line.balance]} />
	{/each}
	<ReportRow label="Retained earnings" amounts={[balanceSheet.retainedEarnings]} />
	<ReportRow label="Total equity" amounts={[balanceSheet.totalEquity]} emphasis="total" />
	<ReportRow
		label="Liabilities and equity"
		amounts={[balanceSheet.totalLiabilities + balanceSheet.totalEquity]}
		emphasis="grand"
	/>
	{#if !balanceSheet.isBalanced}
		<tr><td colspan="2" class="pt-3 text-sm text-caution">The ledger does not balance — check manual journals.</td></tr>
	{/if}
</ReportTable>
