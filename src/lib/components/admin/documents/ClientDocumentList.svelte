<script lang="ts">
	import type { ClientDocumentEntry } from '$lib/data/clientDocumentCatalogue';
	import ClientDocumentRow from './ClientDocumentRow.svelte';

	let {
		heading,
		description,
		entries
	}: { heading: string; description: string; entries: ClientDocumentEntry[] } = $props();
</script>

<section class="flex flex-col gap-3">
	<div class="flex flex-col gap-1">
		<h2 class="font-display text-xl font-medium">{heading}</h2>
		<p class="text-sm text-chalk/60">{description}</p>
	</div>
	<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
		{#each entries as entry (entry.slug)}
			<ClientDocumentRow {entry} />
		{/each}
	</ul>
</section>
