<script lang="ts">
	import { createItemBrain } from './kb3d/createItemBrain';

	let {
		seed,
		accent,
		itemCount,
		hint = 'drag to orbit'
	}: { seed: string; accent: string; itemCount: number; hint?: string } = $props();

	let containerElement = $state<HTMLDivElement>();
	let canvasElement = $state<HTMLCanvasElement>();

	$effect(() => {
		if (canvasElement === undefined || containerElement === undefined) return;
		const brain = createItemBrain(canvasElement, containerElement, { seed, accent, itemCount });
		return () => brain.destroy();
	});
</script>

<div bind:this={containerElement} class="relative h-full w-full overflow-hidden bg-night">
	<canvas bind:this={canvasElement} class="block h-full w-full"></canvas>
	<p
		class="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 font-display
			text-[10px] tracking-widest text-chalk/25 uppercase"
	>
		{hint}
	</p>
</div>
