<script lang="ts">
	import { kindForCategory } from '$lib/data/knowledge/knowledgeKinds';
	import type { BrainTemplate } from '$lib/data/knowledge/brainTemplates';
	import type { BrainCategory } from '$lib/data/knowledge/knowledgeTypes';

	let {
		template,
		category,
		isSelected,
		onSelect
	}: {
		template: BrainTemplate;
		category: BrainCategory;
		isSelected: boolean;
		onSelect: () => void;
	} = $props();

	const accent = $derived(kindForCategory(category).accent);
</script>

<button
	type="button"
	onclick={onSelect}
	class="flex flex-col gap-1.5 rounded-2xl border p-4 text-left transition
		{isSelected ? 'bg-carriage' : 'border-hairline bg-carriage/50 hover:border-chalk/30'}"
	style={isSelected ? `border-color: ${accent}` : ''}
>
	<span class="flex items-center gap-2">
		<span class="font-display text-base font-medium">{template.name}</span>
		{#if template.isRecommended}
			<span
				class="rounded-full px-2 py-0.5 text-[10px] tracking-wider uppercase"
				style={`background-color: ${accent}22; color: ${accent}`}
			>
				Recommended
			</span>
		{/if}
	</span>
	<span class="text-sm text-chalk/60">{template.pitch}</span>
</button>
