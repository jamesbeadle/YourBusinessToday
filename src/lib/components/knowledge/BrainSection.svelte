<script lang="ts">
	import BrainCard from './BrainCard.svelte';
	import { kindForCategory } from '$lib/data/knowledge/knowledgeKinds';
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

	const kind = $derived(kindForCategory(category));
	const isExpertise = $derived(category === 'domain');
	const explainer = $derived(
		isExpertise
			? 'What you know — the rules, language, and models of your trade.'
			: 'What you’ve done — every job, event, and decision, recorded in the terms your expertise defines.'
	);
	const emptyInvitation = $derived(
		isExpertise
			? 'Nothing here yet. Add an Expertise Brain and teach it the rules of your trade.'
			: 'Nothing recorded yet. Add an Experience Brain and capture jobs as they happen.'
	);
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
			<p class="max-w-prose text-sm text-chalk/60">{explainer}</p>
		</div>
		<a
			href={`/knowledge-base/${knowledgeBaseId}/brains/new?kind=${kind.kind}`}
			class="rounded-full px-5 py-2 font-display text-sm font-medium text-night transition
				hover:brightness-110"
			style={`background-color: ${kind.accent}`}
		>
			Add {kind.label}
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
