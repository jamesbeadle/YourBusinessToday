<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';
	import ClientFormFields from '$lib/components/accounting/ClientFormFields.svelte';
	import InvoiceTable from '$lib/components/accounting/InvoiceTable.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import {
		panelClasses,
		primaryButtonClasses,
		quietButtonClasses
	} from '$lib/components/accounting/accountingFormStyles';

	let { data, form } = $props();

	const tracker = new FormTracker();
	const archiveLabel = $derived(data.client.isArchived ? 'Restore client' : 'Archive client');
</script>

<svelte:head>
	<title>{data.client.name} — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader title={data.client.name} description="Their details and every invoice raised to them.">
		{#snippet actions()}
			<a href={`/accounting/invoices?new=1&clientId=${data.client.id}`} class={primaryButtonClasses}>
				Raise an invoice
			</a>
		{/snippet}
	</AccountingPageHeader>
	<ActionMessage message={form?.message} />
	<div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
		<form method="POST" action="?/updateClient" use:enhance={tracker.submit()} class={panelClasses}>
			<h2 class="font-display text-lg font-medium">Details</h2>
			<ClientFormFields client={data.client} />
			<FormErrorNote message={tracker.errorMessage} />
			<div class="flex items-center justify-between gap-3">
				<SubmitButton isSaving={tracker.isSaving}>Save</SubmitButton>
			</div>
		</form>
		<section class="flex flex-col gap-4">
			<h2 class="font-display text-lg font-medium">Invoices</h2>
			<InvoiceTable invoices={data.invoices} emptyMessage="No invoices raised to this client yet." />
			<form method="POST" action="?/setArchived" use:enhance class="flex justify-end">
				<input type="hidden" name="isArchived" value={String(!data.client.isArchived)} />
				<button type="submit" class={quietButtonClasses}>{archiveLabel}</button>
			</form>
		</section>
	</div>
</div>
