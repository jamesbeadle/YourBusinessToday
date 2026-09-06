<script lang="ts">
	import type { ConstellationSlot } from '../constellationSlots';

	let { openSlot }: { openSlot: ConstellationSlot } = $props();
</script>

<div class="flex min-w-0 flex-1 flex-col gap-0.5">
	<h1 class="truncate font-display text-base font-medium text-chalk lg:text-lg">{openSlot.name}</h1>
	<p
		class="truncate font-display text-[10px] tracking-widest uppercase"
		style={`color: ${openSlot.accent}`}
	>
		{openSlot.kindLabel} brain
	</p>
</div>
