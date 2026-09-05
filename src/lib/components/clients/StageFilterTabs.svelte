<script lang="ts">
	import { clientStageLabels, clientStageOrder, type ClientStage } from '$lib/data/clientLifecycle';

	let { chosenStage }: { chosenStage: ClientStage | null } = $props();

	const filterClasses = 'rounded-full border px-4 py-1.5 font-display text-sm transition';
	const chosenClasses = `${filterClasses} border-go/60 text-go`;
	const availableClasses = `${filterClasses} border-hairline text-chalk/60 hover:text-chalk`;
</script>

<nav class="flex flex-wrap gap-3" aria-label="Stage">
	<a href="/clients" class={chosenStage === null ? chosenClasses : availableClasses}>All</a>
	{#each clientStageOrder as stage (stage)}
		<a href={`/clients?stage=${stage}`} class={chosenStage === stage ? chosenClasses : availableClasses}>
			{clientStageLabels[stage]}
		</a>
	{/each}
</nav>
