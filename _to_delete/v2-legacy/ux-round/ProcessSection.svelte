<script lang="ts">
	import ProcessMapCard from './ProcessMapCard.svelte';
	import { findKnowledgeKind } from '$lib/data/knowledge/knowledgeKinds';
	import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

	let {
		knowledgeBaseId,
		processMaps
	}: { knowledgeBaseId: string; processMaps: ProcessMapSummary[] } = $props();

	const kind = findKnowledgeKind('process');
</script>

<section
	class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage/50 p-5"
	style={`border-top: 3px solid ${kind.accent}`}
>
	<header class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-col gap-1">
			<h2 class="font-display text-xl font-medium" style={`color: ${kind.accent}`}>
				{kind.label}
			</h2>
			<p class="max-w-prose text-sm text-chalk/60">
				How you work — every role, task, and handover, drawn as a map.
			</p>
		</div>
		<a
			href={`/knowledge-base/${knowledgeBaseId}/brains/new?kind=process`}
			class="rounded-full px-5 py-2 font-display text-sm font-medium text-night transition
				hover:brightness-110"
			style={`background-color: ${kind.accent}`}
		>
			Add Process
		</a>
	</header>
	{#if processMaps.length === 0}
		<p class="rounded-xl border border-dashed border-hairline p-6 text-center text-sm text-chalk/50">
			Nothing mapped yet. Add a Process Brain and talk to the agent — your process draws
			itself as a map while you answer.
		</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each processMaps as processMap (processMap.id)}
				<ProcessMapCard {processMap} />
			{/each}
		</ul>
	{/if}
</section>
