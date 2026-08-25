<script lang="ts">
	import BankDetailsFields from './BankDetailsFields.svelte';
	import FormField from './FormField.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { inputClasses, panelClasses, selectClasses } from './accountingFormStyles';
	import { monthNames } from './monthNames';
	import type { AccountingSettings } from '$lib/server/accounting/getAccountingSettings';

	let { settings }: { settings: AccountingSettings } = $props();

	const tracker = new FormTracker();
</script>

<form method="POST" action="?/saveSettings" use:enhance={tracker.submit()} class={`${panelClasses} max-w-2xl`}>
	<h2 class="font-display text-lg font-medium">Invoice header</h2>
	<FormField label="Company name">
		<input name="companyName" required value={settings.companyName} class={inputClasses} />
	</FormField>
	<FormField label="Address">
		<textarea name="companyAddress" rows="3" class={inputClasses}>{settings.companyAddress}</textarea>
	</FormField>
	<FormField label="Email">
		<input name="companyEmail" type="email" value={settings.companyEmail} class={inputClasses} />
	</FormField>
	<BankDetailsFields {settings} />
	<h2 class="font-display text-lg font-medium">Numbering and periods</h2>
	<div class="grid gap-4 sm:grid-cols-3">
		<FormField label="Invoice prefix">
			<input name="invoicePrefix" required value={settings.invoicePrefix} class={inputClasses} />
		</FormField>
		<FormField label="Payment terms (days)">
			<input name="paymentTermsDays" type="number" min="0" value={settings.paymentTermsDays} class={inputClasses} />
		</FormField>
		<FormField label="Financial year starts">
			<select name="financialYearStartMonth" value={settings.financialYearStartMonth} class={selectClasses}>
				{#each monthNames as monthName, monthIndex (monthName)}
					<option value={monthIndex + 1}>{monthName}</option>
				{/each}
			</select>
		</FormField>
	</div>
	<p class="text-xs text-chalk/50">Next invoice will be {settings.invoicePrefix}-{settings.nextInvoiceNumber}.</p>
	<FormErrorNote message={tracker.errorMessage} />
	<div class="flex justify-end">
		<SubmitButton isSaving={tracker.isSaving}>Save settings</SubmitButton>
	</div>
</form>
