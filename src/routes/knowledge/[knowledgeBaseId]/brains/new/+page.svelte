<script lang="ts">
	import { page } from '$app/state';
	import BrainTemplatePicker from '$lib/components/knowledge/BrainTemplatePicker.svelte';
	import NewBrainDetailsForm from '$lib/components/knowledge/NewBrainDetailsForm.svelte';
	import {
		advancedTypesFor,
		engineDefinitionFor,
		type BrainTemplate
	} from '$lib/data/knowledge/brainTemplates';
	import { kindForCategory } from '$lib/data/knowledge/knowledgeKinds';
	import type { BrainCategory, BrainType } from '$lib/data/knowledge/knowledgeTypes';

	let { data } = $props();

	const category = $derived(categoryFromQuery(page.url.searchParams.get('category')));
	const kind = $derived(kindForCategory(category));

	let selectedTemplate = $state<BrainTemplate | null>(null);
	let selectedAdvancedType = $state<BrainType | null>(null);

	const selectedDefinition = $derived(
		selectedTemplate === null
			? (advancedTypesFor(category).find(
					(definition) => definition.type === selectedAdvancedType
				) ?? null)
			: engineDefinitionFor(selectedTemplate)
	);

	function categoryFromQuery(value: string | null): BrainCategory {
		return value === 'instance' ? 'instance' : 'domain';
	}

	function selectTemplate(template: BrainTemplate): void {
		selectedTemplate = template;
		selectedAdvancedType = null;
	}

	function selectAdvancedType(type: BrainType): void {
		selectedAdvancedType = type;
		selectedTemplate = null;
	}
</script>

<svelte:head>
	<title>New {kind.label} — {data.knowledgeBase.name}</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
	<nav class="text-sm text-chalk/50">
		<a href="/knowledge" class="transition hover:text-signal">Knowledge Base</a>
		<span class="mx-2">/</span>
		<a href={`/knowledge/${data.knowledgeBase.id}`} class="transition hover:text-signal">
			{data.knowledgeBase.name}
		</a>
		<span class="mx-2">/</span>
		<span class="text-chalk/80">New {kind.label}</span>
	</nav>
	<header class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">{kind.question}</h1>
		<p class="max-w-prose text-chalk/70">
			{category === 'domain'
				? 'Pick what you want to capture. Each template holds a different part of what your business knows.'
				: 'Pick what you want to record. Each template captures what happens in your business a different way.'}
		</p>
	</header>
	<BrainTemplatePicker
		{category}
		selectedTemplateId={selectedTemplate?.id ?? null}
		{selectedAdvancedType}
		onSelectTemplate={selectTemplate}
		onSelectAdvancedType={selectAdvancedType}
	/>
	{#if selectedDefinition !== null}
		<NewBrainDetailsForm
			definition={selectedDefinition}
			domainBrains={data.domainBrains}
			templateName={selectedTemplate?.name ?? null}
		/>
	{/if}
</div>
