<script lang="ts">
	import { formatSortCode, hasBankDetails } from '$lib/data/accounting/bankDetails';
	import type { AccountingSettings } from '$lib/server/accounting/getAccountingSettings';

	let { settings, invoiceNumber }: { settings: AccountingSettings; invoiceNumber: string } = $props();
</script>

<div class="flex flex-col gap-2">
	<p class="font-display text-xs tracking-widest uppercase opacity-60">Pay by bank transfer</p>
	{#if hasBankDetails(settings)}
		<dl class="grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
			<dt class="opacity-60">Account name</dt>
			<dd class="font-medium">{settings.bankAccountName}</dd>
			<dt class="opacity-60">Sort code</dt>
			<dd class="font-medium tabular-nums">{formatSortCode(settings.bankSortCode)}</dd>
			<dt class="opacity-60">Account number</dt>
			<dd class="font-medium tabular-nums">{settings.bankAccountNumber}</dd>
			<dt class="opacity-60">Reference</dt>
			<dd class="font-medium">{invoiceNumber}</dd>
		</dl>
	{/if}
	{#if settings.paymentInstructions}
		<p class="whitespace-pre-line">{settings.paymentInstructions}</p>
	{/if}
</div>
