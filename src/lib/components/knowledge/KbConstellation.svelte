<script lang="ts">
	import { goto } from '$app/navigation';
	import { buildConstellationSlots, type ConstellationSlot } from './constellationSlots';
	import { createKbGalaxy } from './kb3d/createKbGalaxy';
	import { untrack } from 'svelte';
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

	let containerElement = $state<HTMLDivElement>();
	let canvasElement = $state<HTMLCanvasElement>();

	function openSlot(slot: ConstellationSlot): void {
		goto(slot.href);
	}

	$effect(() => {
		void slots;
		if (canvasElement === undefined || containerElement === undefined) return;
		const galaxy = createKbGalaxy(
			canvasElement,
			containerElement,
			untrack(() => slots),
			openSlot
		);
		return () => galaxy.destroy();
	});
</script>

<div bind:this={containerElement} class="relative h-full w-full overflow-hidden bg-night">
	<canvas bind:this={canvasElement} class="block h-full w-full"></canvas>
	<a
		href={`/knowledge-base/${knowledgeBaseId}/brains/new`}
		class="absolute top-4 right-4 z-10 rounded-full border border-hairline bg-night/60 px-4
			py-1.5 font-display text-xs text-chalk/60 backdrop-blur-none transition
			hover:border-signal hover:text-signal"
	>
		+ Add a second brain
	</a>
	<p
		class="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 font-display text-[10px]
			tracking-widest text-chalk/25 uppercase"
	>
		drag to orbit · click a brain to open it
	</p>
</div>
