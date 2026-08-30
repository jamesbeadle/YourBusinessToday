<script lang="ts">
	import KbConstellationNode from './KbConstellationNode.svelte';
	import { buildConstellationSlots } from './constellationSlots';
	import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

	let {
		knowledgeBaseId,
		brains,
		processMaps
	}: {
		knowledgeBaseId: string;
		brains: KbBrainSummary[];
		processMaps: ProcessMapSummary[];
	} = $props();

	const slots = $derived(buildConstellationSlots(knowledgeBaseId, brains, processMaps));
	const addHref = $derived(`/knowledge-base/${knowledgeBaseId}/brains/new`);
	const slotCount = $derived(Math.max(slots.length, 3));

	function slotPosition(slotIndex: number): { x: number; y: number } {
		const angle = -Math.PI / 2 + (2 * Math.PI * slotIndex) / slotCount;
		return { x: 50 + 36 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) };
	}
</script>

<div class="relative h-full w-full overflow-hidden">
	<svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
		{#each slots as slot, slotIndex (slot.kindLabel + slot.id)}
			<line
				x1="50"
				y1="50"
				x2={slotPosition(slotIndex).x}
				y2={slotPosition(slotIndex).y}
				stroke={slot.accent}
				stroke-width="0.15"
				opacity={slot.variant === 'ghost' ? 0.25 : 0.5}
			/>
		{/each}
	</svg>
	<span
		class="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full
			bg-chalk shadow-[0_0_18px_4px_rgba(238,241,248,0.35)]"
		aria-hidden="true"
	></span>
	{#each slots as slot, slotIndex (slot.kindLabel + slot.id)}
		<KbConstellationNode {slot} x={slotPosition(slotIndex).x} y={slotPosition(slotIndex).y} />
	{/each}
	<a
		href={addHref}
		class="absolute right-4 top-4 z-10 rounded-full border border-hairline px-4 py-1.5 font-display
			text-xs text-chalk/60 transition hover:border-signal hover:text-signal"
	>
		+ Add a second brain
	</a>
</div>
