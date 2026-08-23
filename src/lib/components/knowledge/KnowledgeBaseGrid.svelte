<script lang="ts">
	import KnowledgeBaseCard from './KnowledgeBaseCard.svelte';
	import type { KnowledgeBaseSummary } from '$lib/data/knowledge/knowledgeTypes';

	let { knowledgeBases }: { knowledgeBases: KnowledgeBaseSummary[] } = $props();

	let searchText = $state('');
	let shouldShowArchived = $state(false);

	const visibleKnowledgeBases = $derived(
		knowledgeBases
			.filter((knowledgeBase) => shouldShowArchived || !knowledgeBase.isArchived)
			.filter((knowledgeBase) => matchesSearch(knowledgeBase, searchText))
	);

	function matchesSearch(knowledgeBase: KnowledgeBaseSummary, text: string): boolean {
		const needle = text.trim().toLowerCase();
		if (needle === '') return true;
		const haystack = `${knowledgeBase.name} ${knowledgeBase.description}`.toLowerCase();
		return haystack.includes(needle);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-4">
		<input
			type="search"
			placeholder="Search knowledge bases…"
			bind:value={searchText}
			class="w-full max-w-xs rounded-xl border border-hairline bg-night px-4 py-2 text-sm
				text-chalk outline-none focus:border-signal"
		/>
		<label class="flex items-center gap-2 text-sm text-chalk/60">
			<input type="checkbox" bind:checked={shouldShowArchived} class="accent-signal" />
			Show archived
		</label>
	</div>
	{#if visibleKnowledgeBases.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/50">
			Nothing matches — try a different search, or create a new knowledge base.
		</p>
	{:else}
		<ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each visibleKnowledgeBases as knowledgeBase (knowledgeBase.id)}
				<KnowledgeBaseCard {knowledgeBase} />
			{/each}
		</ul>
	{/if}
</div>
