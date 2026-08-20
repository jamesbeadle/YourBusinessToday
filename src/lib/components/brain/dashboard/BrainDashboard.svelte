<script lang="ts">
	import BrainActivityLog from '../BrainActivityLog.svelte';
	import BrainConstellation from '../BrainConstellation.svelte';
	import BrainTerminal from './BrainTerminal.svelte';
	import DomainModelIndex from '../DomainModelIndex.svelte';
	import OutOfCreditsNotice from '../../workspace/OutOfCreditsNotice.svelte';
	import ReviewPanel from '../review/ReviewPanel.svelte';
	import SectionPanel from './SectionPanel.svelte';
	import SectionRail from './SectionRail.svelte';
	import SharePanel from './SharePanel.svelte';
	import SourcesPanel from '../SourcesPanel.svelte';
	import { fetchBrainPage } from '../constellation/fetchBrainPage';
	import { memberSections, ownerSections, type SectionKey } from './railIcons';
	import { onMount } from 'svelte';
	import type { BrainChangeProposal, WorkspaceInvite, WorkspaceShare } from '$lib/data/sharingTypes';
	import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
	import type {
		BrainContext,
		BrainConversationThread,
		BrainEvent,
		BrainPageLink,
		BrainPageSummary,
		BrainSource
	} from '$lib/data/brainTypes';

	let {
		brain,
		isOwner,
		contexts,
		pageIndex,
		pageLinks,
		sources,
		events,
		conversation,
		proposals,
		shares,
		invites
	}: {
		brain: DomainBrain;
		isOwner: boolean;
		contexts: BrainContext[];
		pageIndex: BrainPageSummary[];
		pageLinks: BrainPageLink[];
		sources: BrainSource[];
		events: BrainEvent[];
		conversation: BrainConversationThread;
		proposals: BrainChangeProposal[];
		shares: WorkspaceShare[];
		invites: WorkspaceInvite[];
	} = $props();

	const pageBasePath = $derived(`/workspace/${brain.entityId}/domains/${brain.id}`);
	const sections = $derived(isOwner ? ownerSections : memberSections);

	let activeSection = $state<SectionKey | null>(null);
	let isOutOfCredits = $state(false);
	let constellation = $state<{ drillToNeuron: (slug: string) => void }>();

	onMount(() => {
		if (window.matchMedia('(min-width: 1024px)').matches) activeSection = 'terminal';
	});

	function toggleSection(section: SectionKey): void {
		activeSection = activeSection === section ? null : section;
	}

	function openPageInBrain(slug: string): void {
		if (!window.matchMedia('(min-width: 1024px)').matches) activeSection = null;
		constellation?.drillToNeuron(slug);
	}
</script>

<div class="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-night lg:flex-row">
	<div class="order-2 lg:order-1 lg:contents">
		<SectionRail
			{sections}
			{activeSection}
			badgeCounts={{ review: proposals.length }}
			onSelect={toggleSection}
		/>
	</div>
	<div class="relative order-1 flex min-h-0 min-w-0 flex-1 lg:order-2">
		{#if activeSection !== null}
			<SectionPanel section={activeSection} onClose={() => (activeSection = null)}>
				{#if activeSection === 'terminal'}
					<BrainTerminal
						brainId={brain.id}
						conversationId={conversation.conversationId}
						messages={conversation.messages}
						{pageIndex}
						{pageBasePath}
						onOutOfCredits={() => (isOutOfCredits = true)}
					/>
				{:else if activeSection === 'sources'}
					<div class="min-h-0 flex-1 overflow-y-auto">
						<SourcesPanel
							brainId={brain.id}
							{isOwner}
							{sources}
							onOutOfCredits={() => (isOutOfCredits = true)}
						/>
					</div>
				{:else if activeSection === 'model'}
					<div class="min-h-0 flex-1 overflow-y-auto">
						<DomainModelIndex {contexts} {pageIndex} {pageBasePath} onSelectPage={openPageInBrain} />
					</div>
				{:else if activeSection === 'review'}
					<ReviewPanel brainId={brain.id} {proposals} />
				{:else if activeSection === 'share'}
					<div class="min-h-0 flex-1 overflow-y-auto">
						<SharePanel brainId={brain.id} entityId={brain.entityId} {shares} {invites} />
					</div>
				{:else}
					<div class="min-h-0 flex-1 overflow-y-auto">
						<BrainActivityLog {events} {pageBasePath} />
					</div>
				{/if}
			</SectionPanel>
		{/if}
		<div class="relative min-w-0 flex-1">
			<BrainConstellation
				bind:this={constellation}
				loadPage={(slug) => fetchBrainPage(brain.id, slug)}
				{pageBasePath}
				{contexts}
				{pageIndex}
				{pageLinks}
			/>
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center
					justify-between px-4 py-2"
			>
				<a
					href={`/workspace/${brain.entityId}`}
					class="pointer-events-auto font-display text-xs text-chalk/50 transition hover:text-chalk"
				>
					← {brain.name}
				</a>
				<a
					href={`/api/brain/export?brain=${brain.id}`}
					download
					class="pointer-events-auto font-display text-xs text-chalk/50 underline transition
						hover:text-chalk"
				>
					Export as Markdown
				</a>
			</div>
			{#if isOutOfCredits}
				<div class="absolute inset-x-4 top-4 z-20 overflow-hidden rounded-2xl border border-hairline">
					<OutOfCreditsNotice />
				</div>
			{/if}
		</div>
	</div>
</div>
