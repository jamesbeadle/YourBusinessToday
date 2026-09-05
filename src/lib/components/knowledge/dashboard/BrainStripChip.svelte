<script lang="ts">
	import { knowledgeBaseHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import type { ConstellationSlot } from '../constellationSlots';

	let {
		knowledgeBaseId,
		slot,
		isActive,
		onSelect
	}: {
		knowledgeBaseId: string;
		slot: ConstellationSlot;
		isActive: boolean;
		onSelect: (slot: ConstellationSlot) => void;
	} = $props();

	const isGhost = $derived(slot.variant === 'ghost');
	const href = $derived(isActive ? knowledgeBaseHref(knowledgeBaseId) : slot.href);

	/** A ghost links to the new brain form and the open brain's chip links back out; the rest fly in. */
	function select(event: MouseEvent): void {
		if (isGhost || isActive) return;
		event.preventDefault();
		onSelect(slot);
	}
</script>

<a
	{href}
	aria-current={isActive ? 'page' : undefined}
	title={slot.name}
	onclick={select}
	style={`color: ${slot.accent}`}
	class={[
		'pointer-events-auto flex min-h-11 max-w-44 items-center gap-2 rounded-full border px-4',
		'font-display text-xs transition lg:min-h-0 lg:px-3 lg:py-1.5',
		isActive ? 'border-current bg-carriage' : 'border-hairline bg-night/80 hover:border-current',
		isGhost && 'border-dashed opacity-60 hover:opacity-100'
	]}
>
	<span aria-hidden="true" class="h-2 w-2 shrink-0 rounded-full bg-current"></span>
	<span class="truncate text-chalk/80">{slot.name}</span>
</a>
