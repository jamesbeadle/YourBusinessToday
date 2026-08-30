<script lang="ts">
	import TemplatePickerCard from './TemplatePickerCard.svelte';
	import TypePickerCard from './TypePickerCard.svelte';
	import {
		advancedTypesFor,
		templatesFor,
		type BrainTemplate
	} from '$lib/data/knowledge/brainTemplates';
	import type { BrainCategory, BrainType } from '$lib/data/knowledge/knowledgeTypes';

	let {
		category,
		selectedTemplateId,
		selectedAdvancedType,
		onSelectTemplate,
		onSelectAdvancedType
	}: {
		category: BrainCategory;
		selectedTemplateId: string | null;
		selectedAdvancedType: BrainType | null;
		onSelectTemplate: (template: BrainTemplate) => void;
		onSelectAdvancedType: (type: BrainType) => void;
	} = $props();

	let isAdvancedOpen = $state(false);

	const templates = $derived(templatesFor(category));
	const advancedTypes = $derived(advancedTypesFor(category));
</script>

<div class="flex flex-col gap-4">
	<div class="grid gap-3 md:grid-cols-2">
		{#each templates as template (template.id)}
			<TemplatePickerCard
				{template}
				{category}
				isSelected={selectedTemplateId === template.id}
				onSelect={() => onSelectTemplate(template)}
			/>
		{/each}
	</div>
	<button
		type="button"
		onclick={() => (isAdvancedOpen = !isAdvancedOpen)}
		class="self-start text-sm text-chalk/50 underline underline-offset-4 transition hover:text-chalk"
	>
		{isAdvancedOpen ? 'Hide advanced types' : 'Show advanced types'}
	</button>
	{#if isAdvancedOpen}
		<div class="grid gap-3 md:grid-cols-2">
			{#each advancedTypes as definition (definition.type)}
				<TypePickerCard
					{definition}
					isSelected={selectedAdvancedType === definition.type}
					onSelect={() => onSelectAdvancedType(definition.type)}
				/>
			{/each}
		</div>
	{/if}
</div>
