<script lang="ts">
	import { formatIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { formatMoney } from '$lib/data/accounting/money';
	import type { InvoicePayment } from '$lib/server/accounting/getInvoice';

	let { payments }: { payments: InvoicePayment[] } = $props();
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline p-5">
	<h2 class="font-display text-lg font-medium">Payments</h2>
	<ul class="flex flex-col divide-y divide-hairline text-sm">
		{#each payments as payment (payment.id)}
			<li class="flex justify-between py-2">
				<span class="text-chalk/70">{formatIsoDate(payment.paidOn)}</span>
				<span class="tabular-nums">{formatMoney(payment.amount)}</span>
			</li>
		{/each}
	</ul>
</section>
