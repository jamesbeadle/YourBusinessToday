<script lang="ts">
	import SourceRow from './SourceRow.svelte';
	import SourceUploadPanel from './SourceUploadPanel.svelte';
	import type { BrainSource } from '$lib/data/brainTypes';

	let {
		sources,
		onOutOfCredits
	}: { sources: BrainSource[]; onOutOfCredits: () => void } = $props();
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div>
		<h2 class="font-display text-xl font-medium">Source documents</h2>
		<p class="text-sm text-chalk/60">
			The raw material — every document is read once and remembered in the wiki.
		</p>
	</div>
	<SourceUploadPanel {onOutOfCredits} />
	{#if sources.length > 0}
		<ul class="flex flex-col">
			{#each sources as source (source.id)}
				<SourceRow {source} {onOutOfCredits} />
			{/each}
		</ul>
	{/if}
</section>
