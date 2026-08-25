<script lang="ts">
	import { formatMoney } from '$lib/data/accounting/money';
	import type { InvoiceLine } from '$lib/server/accounting/getInvoice';

	let { lines }: { lines: InvoiceLine[] } = $props();
</script>

<table class="w-full text-sm">
	<thead class="border-b border-map-ink/40 text-left font-display text-xs tracking-widest uppercase opacity-60">
		<tr>
			<th class="py-2">Description</th>
			<th class="py-2 text-right">Qty</th>
			<th class="py-2 text-right">Unit price</th>
			<th class="py-2 text-right">Amount</th>
		</tr>
	</thead>
	<tbody class="divide-y divide-map-grid">
		{#each lines as line (line.id)}
			<tr>
				<td class="py-3">{line.description}</td>
				<td class="py-3 text-right tabular-nums">{line.quantity}</td>
				<td class="py-3 text-right tabular-nums">{formatMoney(line.unitPrice)}</td>
				<td class="py-3 text-right tabular-nums">{formatMoney(line.amount)}</td>
			</tr>
		{/each}
	</tbody>
</table>
