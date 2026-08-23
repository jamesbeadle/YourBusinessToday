<script lang="ts">
	import { categoryAccents } from '$lib/data/knowledge/brainTypeCatalog';
	import type { BrainTypeDefinition } from '$lib/data/knowledge/knowledgeTypes';

	let {
		definition,
		isSelected,
		onSelect
	}: { definition: BrainTypeDefinition; isSelected: boolean; onSelect: () => void } = $props();

	const accent = $derived(categoryAccents[definition.category]);
</script>

<button
	type="button"
	onclick={onSelect}
	class="flex flex-col gap-1.5 rounded-2xl border p-4 text-left transition
		{isSelected ? 'bg-carriage' : 'border-hairline bg-carriage/50 hover:border-chalk/30'}"
	style={isSelected ? `border-color: ${accent}` : ''}
>
	<span class="flex items-center gap-2">
		<span class="font-display text-base font-medium">{definition.label}</span>
		{#if definition.isRecommended}
			<span
				class="rounded-full px-2 py-0.5 text-[10px] tracking-wider uppercase"
				style={`background-color: ${accent}22; color: ${accent}`}
			>
				Recommended
			</span>
		{/if}
	</span>
	<span class="text-xs" style={`color: ${accent}`}>{definition.tagline}</span>
	<span class="text-sm text-chalk/60">{definition.description}</span>
</button>
