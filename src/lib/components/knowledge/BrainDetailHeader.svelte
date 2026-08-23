<script lang="ts">
	import BrainGlyph from './BrainGlyph.svelte';
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import { categoryAccents, categoryLabels, findBrainType } from '$lib/data/knowledge/brainTypeCatalog';
	import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';

	let { brain, isOwner }: { brain: KbBrainSummary; isOwner: boolean } = $props();

	let isDeleteModalOpen = $state(false);

	const definition = $derived(findBrainType(brain.brainType));
	const accent = $derived(categoryAccents[brain.category]);
</script>

<header class="flex flex-wrap items-center justify-between gap-4">
	<div class="flex items-center gap-4">
		<BrainGlyph seed={brain.id} category={brain.category} size={80} />
		<div class="flex flex-col gap-1">
			<div class="flex flex-wrap items-center gap-2">
				<h1 class="font-display text-3xl font-medium">{brain.name}</h1>
				<span
					class="rounded-full border px-2.5 py-0.5 text-xs"
					style={`border-color: ${accent}66; color: ${accent}`}
				>
					{categoryLabels[brain.category]} · {definition?.label ?? brain.brainType}
				</span>
			</div>
			{#if brain.description !== ''}
				<p class="max-w-prose text-chalk/70">{brain.description}</p>
			{/if}
		</div>
	</div>
	{#if isOwner}
		<button
			type="button"
			onclick={() => (isDeleteModalOpen = true)}
			class="rounded-full border border-hairline px-4 py-2 text-sm text-chalk/60 transition
				hover:border-signal hover:text-signal"
		>
			Delete brain
		</button>
	{/if}
</header>

<DangerConfirmModal
	bind:isOpen={isDeleteModalOpen}
	title="Delete this brain?"
	description={`"${brain.name}" and everything stored in it will be removed from this knowledge base.`}
	action="?/deleteBrain"
	fields={{}}
	submitLabel="Delete brain"
/>
