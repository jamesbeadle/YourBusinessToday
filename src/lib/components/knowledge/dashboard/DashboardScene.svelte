<script lang="ts">
	import BrainStrip from './BrainStrip.svelte';
	import DashboardTopBar from './DashboardTopBar.svelte';
	import KbConstellation from '../KbConstellation.svelte';
	import OutOfCreditsNotice from '../../workspace/OutOfCreditsNotice.svelte';
	import { BrainFlight, provideBrainFlight } from './brainFlight.svelte';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import type { ConstellationSlot } from '../constellationSlots';
	import type { KnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';

	let {
		knowledgeBase,
		slots,
		openBrainId,
		isOutOfCredits,
		children
	}: {
		knowledgeBase: KnowledgeBase;
		slots: ConstellationSlot[];
		openBrainId: string | null;
		isOutOfCredits: boolean;
		children: Snippet;
	} = $props();

	const openSlot = $derived(slots.find((slot) => slot.id === openBrainId) ?? null);

	let constellation = $state<KbConstellation>();

	const flight = provideBrainFlight(new BrainFlight(() => constellation, () => openBrainId));

	function selectSlot(slot: ConstellationSlot): void {
		if (slot.variant === 'brain') flight.flyInto(slot.id);
		goto(slot.href, { noScroll: true });
	}
</script>

<div class="relative min-h-0 min-w-0 flex-1">
	<KbConstellation bind:this={constellation} {slots} onSelect={selectSlot} />
	{@render children()}
	<DashboardTopBar knowledgeBaseId={knowledgeBase.id} {openSlot} />
	<BrainStrip knowledgeBaseId={knowledgeBase.id} {slots} activeSlotId={openBrainId} onSelect={selectSlot} />
	{#if isOutOfCredits}
		<div class="absolute inset-x-4 top-16 z-20 overflow-hidden rounded-2xl border border-hairline">
			<OutOfCreditsNotice />
		</div>
	{/if}
</div>
