<script lang="ts">
	import BrainStripChip from './BrainStripChip.svelte';
	import type { ConstellationSlot } from '../constellationSlots';

	let {
		slots,
		activeSlotId,
		onSelect
	}: {
		slots: ConstellationSlot[];
		activeSlotId: string | null;
		onSelect: (slot: ConstellationSlot) => void;
	} = $props();
</script>

<nav
	aria-label="Brains"
	class="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex flex-wrap items-center
		justify-center gap-2 px-4"
>
	{#each slots as slot (slot.id)}
		<BrainStripChip {slot} isActive={slot.id === activeSlotId} {onSelect} />
	{/each}
</nav>
