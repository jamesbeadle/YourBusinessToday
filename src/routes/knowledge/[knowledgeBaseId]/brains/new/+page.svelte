<script lang="ts">
	import { page } from '$app/state';
	import NewBrainDetailsForm from '$lib/components/knowledge/NewBrainDetailsForm.svelte';
	import TypePickerCard from '$lib/components/knowledge/TypePickerCard.svelte';
	import { brainTypesFor, categoryLabels } from '$lib/data/knowledge/brainTypeCatalog';
	import type { BrainCategory, BrainType } from '$lib/data/knowledge/knowledgeTypes';

	let { data } = $props();

	const category = $derived(categoryFromQuery(page.url.searchParams.get('category')));
	const typeChoices = $derived(brainTypesFor(category));

	let selectedType = $state<BrainType | null>(null);

	const selectedDefinition = $derived(
		typeChoices.find((definition) => definition.type === selectedType) ?? null
	);

	function categoryFromQuery(value: string | null): BrainCategory {
		return value === 'instance' ? 'instance' : 'domain';
	}
</script>

<svelte:head>
	<title>New {categoryLabels[category]} — {data.knowledgeBase.name}</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
	<nav class="text-sm text-chalk/50">
		<a href="/knowledge" class="transition hover:text-signal">Knowledge Base</a>
		<span class="mx-2">/</span>
		<a href={`/knowledge/${data.knowledgeBase.id}`} class="transition hover:text-signal">
			{data.knowledgeBase.name}
		</a>
		<span class="mx-2">/</span>
		<span class="text-chalk/80">New {categoryLabels[category]}</span>
	</nav>
	<header class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Choose a {categoryLabels[category]} type</h1>
		<p class="max-w-prose text-chalk/70">
			{category === 'domain'
				? 'Each type structures knowledge a different way. Pick the shape that matches how you think about this domain.'
				: 'Each type captures and retrieves knowledge differently. Pick the one that matches how this data arrives.'}
		</p>
	</header>
	<div class="grid gap-3 md:grid-cols-2">
		{#each typeChoices as definition (definition.type)}
			<TypePickerCard
				{definition}
				isSelected={selectedType === definition.type}
				onSelect={() => (selectedType = definition.type)}
			/>
		{/each}
	</div>
	{#if selectedDefinition !== null}
		<NewBrainDetailsForm definition={selectedDefinition} domainBrains={data.domainBrains} />
	{/if}
</div>
