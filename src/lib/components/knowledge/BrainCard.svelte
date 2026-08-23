<script lang="ts">
	import BrainGlyph from './BrainGlyph.svelte';
	import { categoryAccents, findBrainType } from '$lib/data/knowledge/brainTypeCatalog';
	import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';

	let { brain, boundCount = 0 }: { brain: KbBrainSummary; boundCount?: number } = $props();

	const definition = $derived(findBrainType(brain.brainType));
	const accent = $derived(categoryAccents[brain.category]);
</script>

<li>
	<a
		href={`/knowledge/${brain.knowledgeBaseId}/brains/${brain.id}`}
		class="flex gap-4 rounded-2xl border border-hairline bg-carriage p-4 transition
			hover:border-signal/60"
	>
		<BrainGlyph seed={brain.id} category={brain.category} size={56} />
		<div class="flex min-w-0 flex-col gap-1">
			<p class="truncate font-display text-base font-medium">{brain.name}</p>
			<p class="flex flex-wrap items-center gap-2 text-xs text-chalk/50">
				<span
					class="rounded-full border px-2 py-0.5"
					style={`border-color: ${accent}66; color: ${accent}`}
				>
					{definition?.label ?? brain.brainType}
				</span>
				{#if brain.category === 'instance' && boundCount > 0}
					<span>bound to {boundCount} domain {boundCount === 1 ? 'brain' : 'brains'}</span>
				{/if}
			</p>
			{#if brain.description !== ''}
				<p class="line-clamp-2 text-sm text-chalk/60">{brain.description}</p>
			{/if}
		</div>
	</a>
</li>
