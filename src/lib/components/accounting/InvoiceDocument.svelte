<script lang="ts">
	import InvoiceBrandBar from './InvoiceBrandBar.svelte';
	import InvoiceDocumentLines from './InvoiceDocumentLines.svelte';
	import InvoicePaymentDetails from './InvoicePaymentDetails.svelte';
	import { formatIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { formatMoney } from '$lib/data/accounting/money';
	import type { AccountingSettings } from '$lib/server/accounting/getAccountingSettings';
	import type { InvoiceDetail } from '$lib/server/accounting/getInvoice';

	let { invoice, settings }: { invoice: InvoiceDetail; settings: AccountingSettings } = $props();

	const invoiceNumber = $derived(`${settings.invoicePrefix}-${invoice.invoiceNumber}`);
	const outstanding = $derived(invoice.total - invoice.amountPaid);
</script>

<article
	class="flex flex-col gap-10 rounded-2xl bg-map-paper p-12 text-map-ink shadow-2xl
		print:rounded-none print:p-0 print:shadow-none"
>
	<InvoiceBrandBar companyName={settings.companyName} />
	<header class="flex items-start justify-between gap-8">
		<div class="whitespace-pre-line">
			<p class="font-display text-2xl font-medium">{settings.companyName}</p>
			<p class="text-sm opacity-70">{settings.companyAddress}</p>
			<p class="text-sm opacity-70">{settings.companyEmail}</p>
		</div>
		<div class="text-right">
			<p class="font-display text-3xl font-medium tracking-wide uppercase">Invoice</p>
			<p class="font-display text-lg">{invoiceNumber}</p>
			{#if invoice.status === 'draft'}
				<p class="text-sm text-signal uppercase">Draft</p>
			{/if}
		</div>
	</header>
	<section class="grid gap-8 sm:grid-cols-2">
		<div class="whitespace-pre-line">
			<p class="font-display text-xs tracking-widest uppercase opacity-60">Billed to</p>
			<p class="font-medium">{invoice.client.name}</p>
			{#if invoice.client.contactName}<p class="text-sm">{invoice.client.contactName}</p>{/if}
			<p class="text-sm opacity-70">{invoice.client.address}</p>
		</div>
		<dl class="grid grid-cols-2 gap-x-4 gap-y-1 self-start text-sm sm:justify-self-end">
			<dt class="opacity-60">Issue date</dt>
			<dd>{formatIsoDate(invoice.issueDate)}</dd>
			<dt class="opacity-60">Due date</dt>
			<dd>{formatIsoDate(invoice.dueDate)}</dd>
			{#if invoice.reference}
				<dt class="opacity-60">Reference</dt>
				<dd>{invoice.reference}</dd>
			{/if}
		</dl>
	</section>
	<InvoiceDocumentLines lines={invoice.lines} />
	<section class="flex justify-end">
		<dl class="grid min-w-64 grid-cols-2 gap-x-6 gap-y-1 text-sm">
			<dt class="opacity-60">Total</dt>
			<dd class="text-right font-display text-lg tabular-nums">{formatMoney(invoice.total)}</dd>
			{#if invoice.amountPaid > 0}
				<dt class="opacity-60">Paid</dt>
				<dd class="text-right tabular-nums">{formatMoney(invoice.amountPaid)}</dd>
				<dt class="opacity-60">Balance due</dt>
				<dd class="text-right font-display tabular-nums">{formatMoney(outstanding)}</dd>
			{/if}
		</dl>
	</section>
	<footer class="flex flex-col gap-4 border-t border-map-grid pt-6 text-sm">
		{#if invoice.notes}<p class="whitespace-pre-line">{invoice.notes}</p>{/if}
		<InvoicePaymentDetails {settings} {invoiceNumber} />
	</footer>
</article>
