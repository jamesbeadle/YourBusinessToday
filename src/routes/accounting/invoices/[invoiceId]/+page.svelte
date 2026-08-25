<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';
	import InvoiceActionsPanel from '$lib/components/accounting/InvoiceActionsPanel.svelte';
	import InvoiceDetailsForm from '$lib/components/accounting/InvoiceDetailsForm.svelte';
	import InvoiceLinesEditor from '$lib/components/accounting/InvoiceLinesEditor.svelte';
	import InvoicePaymentsList from '$lib/components/accounting/InvoicePaymentsList.svelte';
	import InvoiceStatusBadge from '$lib/components/accounting/InvoiceStatusBadge.svelte';
	import { canEditInvoice } from '$lib/data/accounting/invoiceStatus';

	let { data, form } = $props();

	const invoice = $derived(data.invoice);
	const isEditable = $derived(canEditInvoice(invoice.status));
</script>

<svelte:head>
	<title>Invoice #{invoice.invoiceNumber} — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title={`Invoice #${invoice.invoiceNumber}`}
		description={`${invoice.client.name} — ${isEditable ? 'still a draft, edit freely.' : 'posted to the ledger.'}`}
	>
		{#snippet actions()}
			<InvoiceStatusBadge status={invoice.status} />
		{/snippet}
	</AccountingPageHeader>
	<ActionMessage message={form?.message} />
	<div class="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
		<div class="flex flex-col gap-8">
			<InvoiceLinesEditor
				{invoice}
				{isEditable}
				incomeAccounts={data.incomeAccounts}
				costCentres={data.costCentres}
			/>
			{#if invoice.payments.length > 0}
				<InvoicePaymentsList payments={invoice.payments} />
			{/if}
		</div>
		<div class="flex flex-col gap-8">
			<InvoiceActionsPanel {invoice} />
			<InvoiceDetailsForm {invoice} {isEditable} clients={data.clients} />
		</div>
	</div>
</div>
