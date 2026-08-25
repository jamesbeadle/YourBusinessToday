<script lang="ts">
	import { formatMoney } from '$lib/data/accounting/money';

	let {
		label,
		amount,
		href,
		tone = 'neutral'
	}: { label: string; amount: number; href?: string; tone?: 'neutral' | 'signed' } = $props();

	const amountClasses = $derived(
		tone === 'signed' && amount < 0 ? 'text-signal' : tone === 'signed' ? 'text-go' : 'text-chalk'
	);
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class="flex flex-col gap-1 rounded-2xl border border-hairline bg-carriage/40 p-5 transition
		hover:border-chalk/30"
>
	<p class="font-display text-xs tracking-widest text-chalk/50 uppercase">{label}</p>
	<p class={`font-display text-2xl font-medium ${amountClasses}`}>{formatMoney(amount)}</p>
</svelte:element>
