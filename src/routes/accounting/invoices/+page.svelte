<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import InvoiceTable from '$lib/components/accounting/InvoiceTable.svelte';
	import NewInvoiceModal from '$lib/components/accounting/NewInvoiceModal.svelte';
	import { primaryButtonClasses } from '$lib/components/accounting/accountingFormStyles';

	let { data } = $props();

	let isNewInvoiceOpen = $derived(data.shouldOpenNewInvoice);
</script>

<svelte:head>
	<title>Invoices — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Invoices"
		description="Draft an invoice, issue it to post the sale, then record the payment when it lands."
	>
		{#snippet actions()}
			<button type="button" onclick={() => (isNewInvoiceOpen = true)} class={primaryButtonClasses}>
				New invoice
			</button>
		{/snippet}
	</AccountingPageHeader>
	<InvoiceTable invoices={data.invoices} emptyMessage="No invoices yet — raise your first one." />
</div>

<NewInvoiceModal
	bind:isOpen={isNewInvoiceOpen}
	clients={data.clients}
	paymentTermsDays={data.paymentTermsDays}
	preselectedClientId={data.preselectedClientId}
/>
