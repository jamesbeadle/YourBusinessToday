<script lang="ts">
	import EmptyState from './EmptyState.svelte';
	import InvoiceStatusBadge from './InvoiceStatusBadge.svelte';
	import { formatIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { formatMoney } from '$lib/data/accounting/money';
	import { canEditInvoice } from '$lib/data/accounting/invoiceStatus';
	import type { InvoiceSummary } from '$lib/server/accounting/getInvoiceList';

	let { invoices, emptyMessage }: { invoices: InvoiceSummary[]; emptyMessage: string } = $props();
</script>

{#if invoices.length === 0}
	<EmptyState message={emptyMessage} />
{:else}
	<div class="overflow-x-auto rounded-2xl border border-hairline">
		<table class="w-full text-sm">
			<thead class="bg-carriage/60 text-left font-display text-xs tracking-widest text-chalk/50 uppercase">
				<tr>
					<th class="px-5 py-3">Number</th>
					<th class="px-5 py-3">Client</th>
					<th class="px-5 py-3">Issued</th>
					<th class="px-5 py-3">Due</th>
					<th class="px-5 py-3 text-right">Total</th>
					<th class="px-5 py-3 text-right">Outstanding</th>
					<th class="px-5 py-3">Status</th>
					<th class="px-5 py-3"><span class="sr-only">Open</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-hairline">
				{#each invoices as invoice (invoice.id)}
					<tr class="transition hover:bg-carriage/40">
						<td class="px-5 py-3 font-display">
							<a href={`/accounting/invoices/${invoice.id}`} class="hover:text-signal">
								#{invoice.invoiceNumber}
							</a>
						</td>
						<td class="px-5 py-3">{invoice.clientName}</td>
						<td class="px-5 py-3 text-chalk/70">{formatIsoDate(invoice.issueDate)}</td>
						<td class="px-5 py-3 text-chalk/70">{formatIsoDate(invoice.dueDate)}</td>
						<td class="px-5 py-3 text-right tabular-nums">{formatMoney(invoice.total)}</td>
						<td class="px-5 py-3 text-right tabular-nums">
							{formatMoney(invoice.total - invoice.amountPaid)}
						</td>
						<td class="px-5 py-3"><InvoiceStatusBadge status={invoice.status} /></td>
						<td class="px-5 py-3 text-right">
							<a href={`/accounting/invoices/${invoice.id}`} class="font-display text-signal hover:underline">
								{canEditInvoice(invoice.status) ? 'Edit' : 'View'}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
