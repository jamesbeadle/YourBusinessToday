<script lang="ts">
	import { createKbGalaxy } from './kb3d/createKbGalaxy';
	import { untrack } from 'svelte';
	import type { ConstellationSlot } from './constellationSlots';

	let {
		slots,
		onSelect
	}: {
		slots: ConstellationSlot[];
		onSelect: (slot: ConstellationSlot) => void;
	} = $props();

	let containerElement = $state<HTMLDivElement>();
	let canvasElement = $state<HTMLCanvasElement>();

	$effect(() => {
		void slots;
		if (canvasElement === undefined || containerElement === undefined) return;
		const galaxy = createKbGalaxy(
			canvasElement,
			containerElement,
			untrack(() => slots),
			onSelect
		);
		return () => galaxy.destroy();
	});
</script>

<div bind:this={containerElement} class="relative h-full w-full overflow-hidden bg-night">
	<canvas bind:this={canvasElement} class="block h-full w-full"></canvas>
	<p
		class="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 font-display text-[10px]
			tracking-widest whitespace-nowrap text-chalk/25 uppercase"
	>
		drag to orbit · tap a brain to open it
	</p>
</div>
