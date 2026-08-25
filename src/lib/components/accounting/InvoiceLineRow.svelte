<script lang="ts">
	import InvoiceLineFields from './InvoiceLineFields.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { formatMoney } from '$lib/data/accounting/money';
	import { confirmButtonClasses, dangerButtonClasses } from './accountingFormStyles';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import type { InvoiceLine } from '$lib/server/accounting/getInvoice';
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

	let {
		line,
		isEditable,
		incomeAccounts,
		costCentres
	}: {
		line: InvoiceLine;
		isEditable: boolean;
		incomeAccounts: LedgerAccount[];
		costCentres: CostCentre[];
	} = $props();

	const tracker = new FormTracker();
	const accountName = $derived(
		incomeAccounts.find((account) => account.id === line.incomeAccountId)?.name ?? ''
	);
</script>

<li class="py-4">
	{#if isEditable}
		<form method="POST" action="?/updateLine" use:enhance={tracker.submit()} class="flex flex-col gap-3">
			<input type="hidden" name="lineId" value={line.id} />
			<InvoiceLineFields {line} {incomeAccounts} {costCentres} />
			<FormErrorNote message={tracker.errorMessage} />
			<div class="flex items-center justify-between gap-3">
				<span class="font-display text-sm tabular-nums">{formatMoney(line.amount)}</span>
				<div class="flex gap-2">
					<button type="submit" formaction="?/deleteLine" formnovalidate class={dangerButtonClasses}>
						Remove
					</button>
					<SubmitButton isSaving={tracker.isSaving} class={confirmButtonClasses}>Save line</SubmitButton>
				</div>
			</div>
		</form>
	{:else}
		<div class="flex flex-wrap items-baseline justify-between gap-3">
			<div>
				<p>{line.description}</p>
				<p class="text-xs text-chalk/50">
					{line.quantity} × {formatMoney(line.unitPrice)} · {accountName}
				</p>
			</div>
			<span class="font-display tabular-nums">{formatMoney(line.amount)}</span>
		</div>
	{/if}
</li>
