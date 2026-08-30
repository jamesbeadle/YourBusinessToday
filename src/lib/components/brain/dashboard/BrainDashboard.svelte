<script lang="ts">
	import BrainConstellation from '../BrainConstellation.svelte';
	import BrainSettingsPanel from './BrainSettingsPanel.svelte';
	import BrainTerminal from './BrainTerminal.svelte';
	import DomainModelIndex from '../DomainModelIndex.svelte';
	import OutOfCreditsNotice from '../../workspace/OutOfCreditsNotice.svelte';
	import PruneKnowledgeButton from '../PruneKnowledgeButton.svelte';
	import SectionPanel from './SectionPanel.svelte';
	import SectionRail from './SectionRail.svelte';
	import { fetchBrainPage } from '../constellation/fetchBrainPage';
	import { memberSections, ownerSections, readerSections, type SectionKey } from './railIcons';
	import { onMount } from 'svelte';
	import type { BrainAccessRole } from '$lib/data/marketTypes';
	import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
	import type { KnowledgeBaseSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type {
		BrainContext,
		BrainConversationThread,
		BrainPageLink,
		BrainPageSummary
	} from '$lib/data/brainTypes';

	let {
		brain,
		accessRole,
		contexts,
		pageIndex,
		pageLinks,
		conversation,
		knowledgeBases,
		filedKnowledgeBaseName
	}: {
		brain: DomainBrain;
		accessRole: BrainAccessRole;
		contexts: BrainContext[];
		pageIndex: BrainPageSummary[];
		pageLinks: BrainPageLink[];
		conversation: BrainConversationThread;
		knowledgeBases: KnowledgeBaseSummary[];
		filedKnowledgeBaseName: string | null;
	} = $props();

	const isOwner = $derived(accessRole === 'owner');
	const pageBasePath = $derived(`/workspace/${brain.entityId}/domains/${brain.id}`);
	const sectionsByRole: Record<BrainAccessRole, SectionKey[]> = {
		owner: ownerSections,
		collaborator: memberSections,
		reader: readerSections
	};
	const sections = $derived(sectionsByRole[accessRole]);

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
		<SectionRail {sections} {activeSection} onSelect={toggleSection} />
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
				{:else if activeSection === 'model'}
					<div class="min-h-0 flex-1 overflow-y-auto">
						{#if isOwner}
							<div class="px-4 pt-4">
								<PruneKnowledgeButton
									brainId={brain.id}
									onOutOfCredits={() => (isOutOfCredits = true)}
								/>
							</div>
						{/if}
						<DomainModelIndex {contexts} {pageIndex} {pageBasePath} onSelectPage={openPageInBrain} />
					</div>
				{:else}
					<BrainSettingsPanel {brain} {knowledgeBases} {filedKnowledgeBaseName} />
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
				{#if isOwner}
					<a
						href={`/api/brain/export?brain=${brain.id}`}
						download
						class="pointer-events-auto font-display text-xs text-chalk/50 underline transition
							hover:text-chalk"
					>
						Export as Markdown
					</a>
				{/if}
			</div>
			{#if isOutOfCredits}
				<div class="absolute inset-x-4 top-4 z-20 overflow-hidden rounded-2xl border border-hairline">
					<OutOfCreditsNotice />
				</div>
			{/if}
		</div>
	</div>
</div>
