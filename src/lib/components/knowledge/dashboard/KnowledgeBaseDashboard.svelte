<script lang="ts">
	import BrainStrip from './BrainStrip.svelte';
	import DashboardPanel from './DashboardPanel.svelte';
	import DashboardToolbar from './DashboardToolbar.svelte';
	import KbConstellation from '../KbConstellation.svelte';
	import KnowledgeBaseToolset from './KnowledgeBaseToolset.svelte';
	import OutOfCreditsNotice from '../../workspace/OutOfCreditsNotice.svelte';
	import { provideDashboardTools } from './dashboardTools.svelte';
	import { openingKnowledgeBaseTool } from './knowledgeBaseTools';
	import { buildConstellationSlots, type ConstellationSlot } from '../constellationSlots';
	import { newBrainHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
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

	let isOutOfCredits = $state(false);

	onMount(() => {
		dashboardTools.open(openingKnowledgeBaseTool(page.url, isOwner, screen.isWideScreen));
	});

	function selectSlot(slot: ConstellationSlot): void {
		goto(slot.href, { noScroll: true });
	}
</script>

<div class="flex h-full w-full overflow-hidden bg-night">
	<div class="relative min-w-0 flex-1">
		<KbConstellation {slots} onSelect={selectSlot} />
		{@render children()}
		<div
			class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between
				gap-3 p-3"
		>
			<a
				href={newBrainHref(knowledgeBase.id)}
				class="pointer-events-auto rounded-full border border-hairline bg-night/80 px-4 py-1.5
					font-display text-xs text-chalk/60 transition hover:border-signal hover:text-signal"
			>
				+ Add a second brain
			</a>
			<DashboardToolbar
				tools={dashboardTools.tools}
				activeKey={dashboardTools.activeKey}
				badgeCounts={{ review: workbench.proposals.length }}
				onSelect={(key) => dashboardTools.toggle(key)}
			/>
		</div>
		<BrainStrip {slots} activeSlotId={openBrainId} onSelect={selectSlot} />
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
