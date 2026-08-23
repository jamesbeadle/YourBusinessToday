<script lang="ts">
	import BrainCard from './BrainCard.svelte';
	import { categoryAccents } from '$lib/data/knowledge/brainTypeCatalog';
	import type { BrainCategory, KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';

	let {
		knowledgeBaseId,
		category,
		brains,
		boundCounts = {}
	}: {
		knowledgeBaseId: string;
		category: BrainCategory;
		brains: KbBrainSummary[];
		boundCounts?: Record<string, number>;
	} = $props();

	const accent = $derived(categoryAccents[category]);
	const isDomain = $derived(category === 'domain');
	const title = $derived(isDomain ? 'Domain Brains' : 'Instance Brains');
	const explainer = $derived(
		isDomain
			? 'Abstract structure: the types, rules, and models your knowledge conforms to.'
			: 'Populated data: the notes, records, events, and facts that fill the structures.'
	);
	const emptyInvitation = $derived(
		isDomain
			? 'No structure yet. Start with an Ontology / Schema brain — it’s the recommended default.'
			: 'No data yet. Atomic Notes is the quickest way to start capturing knowledge.'
	);
</script>

<section
	class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage/50 p-5"
	style={`border-top: 3px solid ${accent}`}
>
	<header class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-col gap-1">
			<h2 class="font-display text-xl font-medium" style={`color: ${accent}`}>{title}</h2>
			<p class="max-w-prose text-sm text-chalk/60">{explainer}</p>
		</div>
		<a
			href={`/knowledge/${knowledgeBaseId}/brains/new?category=${category}`}
			class="rounded-full px-5 py-2 font-display text-sm font-medium text-night transition
				hover:brightness-110"
			style={`background-color: ${accent}`}
		>
			Create {isDomain ? 'Domain' : 'Instance'} Brain
		</a>
	</header>
	{#if brains.length === 0}
		<p class="rounded-xl border border-dashed border-hairline p-6 text-center text-sm text-chalk/50">
			{emptyInvitation}
		</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each brains as brain (brain.id)}
				<BrainCard {brain} boundCount={boundCounts[brain.id] ?? 0} />
			{/each}
		</ul>
	{/if}
</section>
