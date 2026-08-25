<script lang="ts">
	import AddInvoiceLineForm from './AddInvoiceLineForm.svelte';
	import InvoiceLineRow from './InvoiceLineRow.svelte';
	import { formatMoney } from '$lib/data/accounting/money';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import type { InvoiceDetail } from '$lib/server/accounting/getInvoice';
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

	let {
		invoice,
		isEditable,
		incomeAccounts,
		costCentres
	}: {
		invoice: InvoiceDetail;
		isEditable: boolean;
		incomeAccounts: LedgerAccount[];
		costCentres: CostCentre[];
	} = $props();
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline p-5">
	<h2 class="font-display text-lg font-medium">Lines</h2>
	{#if invoice.lines.length === 0}
		<p class="text-sm text-chalk/60">No lines yet — add what you're charging for below.</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline">
			{#each invoice.lines as line (line.id)}
				<InvoiceLineRow {line} {isEditable} {incomeAccounts} {costCentres} />
			{/each}
		</ul>
	{/if}
	<div class="flex items-center justify-between border-t border-hairline pt-4">
		<span class="font-display text-sm text-chalk/60">Total</span>
		<span class="font-display text-xl font-medium tabular-nums">{formatMoney(invoice.total)}</span>
	</div>
	{#if isEditable}
		<AddInvoiceLineForm {incomeAccounts} {costCentres} />
	{/if}
</section>
