<script lang="ts">
	import type { HarnessTable } from '$lib/data/harnessDiagram';

	let { table }: { table: HarnessTable } = $props();
</script>

<div class="rounded-lg border border-hairline bg-night/70 px-3 py-2 font-mono text-xs">
	<p class="font-medium text-chalk">{table.name}</p>
	<ul class="mt-1 flex flex-col gap-0.5 text-chalk/50">
		{#each table.columns as column (column)}
			<li>{column}</li>
		{/each}
	</ul>
</div>
