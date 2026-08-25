<script lang="ts">
	import FormField from './FormField.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { inputClasses, panelClasses, selectClasses } from './accountingFormStyles';
	import type { Client } from '$lib/server/accounting/getClients';
	import type { InvoiceDetail } from '$lib/server/accounting/getInvoice';

	let {
		invoice,
		isEditable,
		clients
	}: { invoice: InvoiceDetail; isEditable: boolean; clients: Client[] } = $props();

	const tracker = new FormTracker();
</script>

<form method="POST" action="?/updateDetails" use:enhance={tracker.submit()} class={panelClasses}>
	<h2 class="font-display text-lg font-medium">Details</h2>
	<fieldset disabled={!isEditable} class="flex flex-col gap-4 disabled:opacity-70">
		<FormField label="Client">
			<select name="clientId" value={invoice.client.id} class={selectClasses}>
				{#each clients as client (client.id)}
					<option value={client.id}>{client.name}</option>
				{/each}
			</select>
		</FormField>
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField label="Issue date">
				<input name="issueDate" type="date" value={invoice.issueDate} class={inputClasses} />
			</FormField>
			<FormField label="Due date">
				<input name="dueDate" type="date" value={invoice.dueDate} class={inputClasses} />
			</FormField>
		</div>
		<FormField label="Your reference">
			<input name="reference" value={invoice.reference} class={inputClasses} />
		</FormField>
		<FormField label="Notes shown on the invoice">
			<textarea name="notes" rows="3" class={inputClasses}>{invoice.notes}</textarea>
		</FormField>
	</fieldset>
	<FormErrorNote message={tracker.errorMessage} />
	{#if isEditable}
		<div class="flex justify-end">
			<SubmitButton isSaving={tracker.isSaving}>Save details</SubmitButton>
		</div>
	{/if}
</form>
