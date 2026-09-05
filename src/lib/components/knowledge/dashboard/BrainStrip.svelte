<script lang="ts">
	import BrainStripChip from './BrainStripChip.svelte';
	import { knowledgeBaseHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import type { ConstellationSlot } from '../constellationSlots';

	let {
		knowledgeBaseId,
		slots,
		activeSlotId,
		onSelect
	}: {
		knowledgeBaseId: string;
		slots: ConstellationSlot[];
		activeSlotId: string | null;
		onSelect: (slot: ConstellationSlot) => void;
	} = $props();
</script>

<div
	class="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2
		px-4 pb-3 lg:pb-4"
>
	<nav aria-label="Brains" class="flex flex-wrap items-center justify-center gap-2">
		{#each slots as slot (slot.id)}
			<BrainStripChip {knowledgeBaseId} {slot} isActive={slot.id === activeSlotId} {onSelect} />
		{/each}
	</nav>
	{#if activeSlotId !== null}
		<a
			href={knowledgeBaseHref(knowledgeBaseId)}
			class="pointer-events-auto flex min-h-11 items-center font-display text-xs text-chalk/50
				transition hover:text-chalk lg:absolute lg:bottom-4 lg:left-4 lg:min-h-0"
		>
			← Knowledge base
		</a>
	{/if}
</div>
