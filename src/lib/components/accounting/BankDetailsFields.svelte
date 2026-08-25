<script lang="ts">
	import FormField from './FormField.svelte';
	import { inputClasses } from './accountingFormStyles';
	import type { AccountingSettings } from '$lib/server/accounting/getAccountingSettings';

	let { settings }: { settings: AccountingSettings } = $props();
</script>

<h2 class="font-display text-lg font-medium">Bank details for payment</h2>
<p class="-mt-2 text-sm text-chalk/60">Printed at the foot of every invoice with the invoice number as the reference.</p>
<FormField label="Account name">
	<input name="bankAccountName" value={settings.bankAccountName} class={inputClasses} />
</FormField>
<div class="grid gap-4 sm:grid-cols-2">
	<FormField label="Sort code">
		<input name="bankSortCode" inputmode="numeric" value={settings.bankSortCode} class={inputClasses} />
	</FormField>
	<FormField label="Account number">
		<input name="bankAccountNumber" inputmode="numeric" value={settings.bankAccountNumber} class={inputClasses} />
	</FormField>
</div>
<FormField label="Extra payment notes (optional)">
	<textarea name="paymentInstructions" rows="2" class={inputClasses}>{settings.paymentInstructions}</textarea>
</FormField>
