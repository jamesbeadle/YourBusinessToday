<script lang="ts">
	import { formatMoney } from '$lib/data/accounting/money';

	let {
		label,
		amounts,
		emphasis = 'line'
	}: { label: string; amounts: number[]; emphasis?: 'heading' | 'line' | 'total' | 'grand' } = $props();

	const rowClasses: Record<typeof emphasis, string> = {
		heading: 'font-display text-xs tracking-widest text-chalk/50 uppercase print:text-black/50',
		line: 'text-chalk/80 print:text-black',
		total: 'border-t border-hairline font-display print:border-black/20',
		grand: 'border-t-2 border-chalk/40 font-display text-base font-medium print:border-black'
	};
</script>

<tr class={rowClasses[emphasis]}>
	<td class={`py-1.5 ${emphasis === 'line' ? 'pl-4' : ''}`}>{label}</td>
	{#each amounts as amount, amountIndex (amountIndex)}
		<td class="py-1.5 text-right tabular-nums">{formatMoney(amount)}</td>
	{/each}
</tr>
