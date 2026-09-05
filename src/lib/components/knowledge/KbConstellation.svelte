<script lang="ts">
	import { createKbGalaxy, type KbGalaxyExperience } from './kb3d/createKbGalaxy';
	import type { FocusOptions } from './kb3d/kbGalaxyFocus';
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
	let galaxy: KbGalaxyExperience | null = null;
	let shownSlots: ConstellationSlot[] | null = null;
	let focusedSlotId: string | null = null;
	let isPaused = false;

	export function focusSlot(slotId: string, options: FocusOptions = {}): void {
		focusedSlotId = slotId;
		galaxy?.focusSlot(slotId, options);
	}

	export function releaseFocus(): void {
		focusedSlotId = null;
		galaxy?.releaseFocus();
	}

	export function pause(): void {
		isPaused = true;
		galaxy?.pause();
	}

	export function resume(): void {
		isPaused = false;
		galaxy?.resume();
	}

	function applyIntent(created: KbGalaxyExperience): void {
		if (focusedSlotId !== null) created.focusSlot(focusedSlotId, { isInstant: true });
		if (isPaused) created.pause();
	}

	$effect(() => {
		if (canvasElement === undefined || containerElement === undefined) return;
		const initialSlots = untrack(() => slots);
		const created = createKbGalaxy(canvasElement, containerElement, initialSlots, onSelect);
		applyIntent(created);
		galaxy = created;
		shownSlots = initialSlots;
		return () => {
			created.destroy();
			galaxy = null;
		};
	});

	$effect(() => {
		if (galaxy === null || shownSlots === slots) return;
		galaxy.updateSlots(slots);
		shownSlots = slots;
	});
</script>

<div bind:this={containerElement} class="relative h-full w-full overflow-hidden bg-night">
	<canvas bind:this={canvasElement} class="block h-full w-full"></canvas>
	<p
		class="pointer-events-none absolute bottom-16 left-1/2 hidden -translate-x-1/2 font-display
			text-[10px] tracking-widest whitespace-nowrap text-chalk/25 uppercase lg:block"
	>
		drag to orbit · click a brain to open it
	</p>
</div>
