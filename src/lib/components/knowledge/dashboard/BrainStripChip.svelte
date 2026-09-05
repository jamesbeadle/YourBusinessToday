<script lang="ts">
	import type { ConstellationSlot } from '../constellationSlots';

	let {
		slot,
		isActive,
		onSelect
	}: {
		slot: ConstellationSlot;
		isActive: boolean;
		onSelect: (slot: ConstellationSlot) => void;
	} = $props();

	const isGhost = $derived(slot.variant === 'ghost');

	function select(event: MouseEvent): void {
		if (isGhost) return;
		event.preventDefault();
		onSelect(slot);
	}
</script>

<a
	href={slot.href}
	aria-current={isActive ? 'page' : undefined}
	title={slot.name}
	onclick={select}
	style={`color: ${slot.accent}`}
	class={[
		'pointer-events-auto flex max-w-40 items-center gap-2 rounded-full border px-3 py-1.5',
		'font-display text-xs transition',
		isActive ? 'border-current bg-carriage' : 'border-hairline bg-night/80 hover:border-current',
		isGhost && 'border-dashed opacity-60 hover:opacity-100'
	]}
>
	<span aria-hidden="true" class="h-2 w-2 shrink-0 rounded-full bg-current"></span>
	<span class="truncate text-chalk/80">{slot.name}</span>
</a>
