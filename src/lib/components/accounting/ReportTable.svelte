<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		columnHeadings,
		children
	}: { title: string; subtitle: string; columnHeadings: string[]; children: Snippet } = $props();
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline p-5 print:border-black/20 print:text-black">
	<div>
		<h2 class="font-display text-lg font-medium">{title}</h2>
		<p class="text-sm text-chalk/60 print:text-black/60">{subtitle}</p>
	</div>
	<table class="w-full text-sm">
		<thead class="text-left font-display text-xs tracking-widest text-chalk/50 uppercase print:text-black/50">
			<tr>
				<th class="py-2"></th>
				{#each columnHeadings as heading (heading)}
					<th class="py-2 text-right">{heading}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{@render children()}
		</tbody>
	</table>
</section>
