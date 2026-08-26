<script lang="ts">
	import InvoiceDocument from '$lib/components/accounting/InvoiceDocument.svelte';
	import { primaryButtonClasses, quietButtonClasses } from '$lib/components/accounting/accountingFormStyles';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.settings.invoicePrefix}-{data.invoice.invoiceNumber} — {data.invoice.client.name}</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10 print:max-w-none print:p-0">
	<div class="flex items-center justify-between print:hidden">
		<a href={`/accounting/invoices/${data.invoice.id}`} class={quietButtonClasses}>← Back to invoice</a>
		<button type="button" onclick={() => window.print()} class={primaryButtonClasses}>
			Print or save as PDF
		</button>
	</div>
	<InvoiceDocument invoice={data.invoice} settings={data.settings} />
</div>

<style>
	@media print {
		:global(body) {
			background: white;
		}
	}
</style>
