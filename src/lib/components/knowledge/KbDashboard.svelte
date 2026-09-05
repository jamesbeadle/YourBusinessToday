<script lang="ts">
	import KbConstellation from './KbConstellation.svelte';
	import KbPanelContent from './KbPanelContent.svelte';
	import OutOfCreditsNotice from '../workspace/OutOfCreditsNotice.svelte';
	import RailNav from '../shell/RailNav.svelte';
	import RailPanel from '../shell/RailPanel.svelte';
	import { kbRailItemsFor, kbSectionLabel, openingKbSection, type KbSectionKey } from './kbRail';
	import { isWideScreen } from '$lib/client/isWideScreen';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
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
		workbench
	}: {
		knowledgeBase: KnowledgeBase;
		isOwner: boolean;
		brains: KbBrainSummary[];
		processMaps: ProcessMapSummary[];
		shares: KnowledgeBaseShare[];
		chatbots: ChatbotSummary[];
		workbench: KbWorkbenchData;
	} = $props();

	const railItems = $derived(kbRailItemsFor(isOwner));

	let activeSection = $state<KbSectionKey | null>(null);
	let isOutOfCredits = $state(false);

	onMount(() => {
		activeSection = openingKbSection(page.url, isOwner, isWideScreen());
	});

	function toggleSection(sectionKey: string): void {
		const section = sectionKey as KbSectionKey;
		activeSection = activeSection === section ? null : section;
	}
</script>

<div class="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-night lg:flex-row">
	<div class="order-2 lg:order-1 lg:contents">
		<RailNav
			items={railItems}
			activeKey={activeSection}
			badgeCounts={{ review: workbench.proposals.length }}
			onSelect={toggleSection}
		/>
	</div>
	<div class="relative order-1 flex min-h-0 min-w-0 flex-1 lg:order-2">
		{#if activeSection !== null}
			<RailPanel title={kbSectionLabel(activeSection)} onClose={() => (activeSection = null)}>
				<KbPanelContent
					section={activeSection}
					{knowledgeBase}
					{isOwner}
					{brains}
					{processMaps}
					{shares}
					{chatbots}
					{workbench}
					onOutOfCredits={() => (isOutOfCredits = true)}
				/>
			</RailPanel>
		{/if}
		<div class="relative min-w-0 flex-1">
			<KbConstellation knowledgeBaseId={knowledgeBase.id} {brains} {processMaps} />
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center
					justify-between px-4 py-2"
			>
				<a
					href="/knowledge-base"
					class="pointer-events-auto font-display text-xs text-chalk/50 transition hover:text-chalk"
				>
					← Knowledge Base
				</a>
				<span class="font-display text-xs text-chalk/50">
					{knowledgeBase.name}{knowledgeBase.isArchived ? ' · archived' : ''}
				</span>
			</div>
			{#if isOutOfCredits}
				<div class="absolute inset-x-4 top-4 z-20 overflow-hidden rounded-2xl border border-hairline">
					<OutOfCreditsNotice />
				</div>
			{/if}
		</div>
	</div>
</div>
