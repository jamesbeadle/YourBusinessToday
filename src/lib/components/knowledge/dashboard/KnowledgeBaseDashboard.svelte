<script lang="ts">
	import BrainStrip from './BrainStrip.svelte';
	import DashboardPanel from './DashboardPanel.svelte';
	import DashboardTopBar from './DashboardTopBar.svelte';
	import KbConstellation from '../KbConstellation.svelte';
	import KnowledgeBaseToolset from './KnowledgeBaseToolset.svelte';
	import OutOfCreditsNotice from '../../workspace/OutOfCreditsNotice.svelte';
	import { BrainFlight, provideBrainFlight } from './brainFlight.svelte';
	import { provideDashboardTools } from './dashboardTools.svelte';
	import { openingKnowledgeBaseTool } from './knowledgeBaseTools';
	import { buildConstellationSlots, type ConstellationSlot } from '../constellationSlots';
	import { screen } from '$lib/client/screen.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount, type Snippet } from 'svelte';
	import type { ChatbotSummary } from '$lib/data/chatbotTypes';
	import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type { KbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';
	import type { KnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
	import type { KnowledgeBaseShare } from '$lib/server/knowledge/knowledgeBaseShares';
	import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

	let {
		knowledgeBase,
		isOwner,
		brains,
		processMaps,
		shares,
		chatbots,
		workbench,
		children
	}: {
		knowledgeBase: KnowledgeBase;
		isOwner: boolean;
		brains: KbBrainSummary[];
		processMaps: ProcessMapSummary[];
		shares: KnowledgeBaseShare[];
		chatbots: ChatbotSummary[];
		workbench: KbWorkbenchData;
		children: Snippet;
	} = $props();

	const dashboardTools = provideDashboardTools();
	const slots = $derived(buildConstellationSlots(knowledgeBase.id, brains, processMaps));
	const openBrainId = $derived(page.params.brainId ?? null);
	const openSlot = $derived(slots.find((slot) => slot.id === openBrainId) ?? null);

	let constellation = $state<KbConstellation>();
	let isOutOfCredits = $state(false);

	const flight = provideBrainFlight(new BrainFlight(() => constellation, () => openBrainId));

	onMount(() => {
		dashboardTools.open(openingKnowledgeBaseTool(page.url, isOwner, screen.isWideScreen));
	});

	function selectSlot(slot: ConstellationSlot): void {
		if (slot.variant === 'brain') flight.flyInto(slot.id);
		goto(slot.href, { noScroll: true });
	}
</script>

<div class="flex h-full w-full overflow-hidden bg-night">
	<div class="relative min-w-0 flex-1">
		<KbConstellation bind:this={constellation} {slots} onSelect={selectSlot} />
		{@render children()}
		<DashboardTopBar
			knowledgeBaseId={knowledgeBase.id}
			{openSlot}
			badgeCounts={{ review: workbench.proposals.length }}
		/>
		<BrainStrip
			knowledgeBaseId={knowledgeBase.id}
			{slots}
			activeSlotId={openBrainId}
			onSelect={selectSlot}
		/>
		{#if isOutOfCredits}
			<div class="absolute inset-x-4 top-16 z-20 overflow-hidden rounded-2xl border border-hairline">
				<OutOfCreditsNotice />
			</div>
		{/if}
	</div>
	<KnowledgeBaseToolset
		{knowledgeBase}
		{isOwner}
		{shares}
		{chatbots}
		{workbench}
		onOutOfCredits={() => (isOutOfCredits = true)}
	/>
	{#if dashboardTools.activeTool !== null}
		<DashboardPanel title={dashboardTools.activeTool.label} onClose={() => dashboardTools.close()}>
			{@render dashboardTools.activeTool.panel()}
		</DashboardPanel>
	{/if}
</div>
