<script lang="ts">
	import ApiPanel from '../brain/dashboard/ApiPanel.svelte';
	import ChatbotsPanel from '../chatbots/ChatbotsPanel.svelte';
	import BrainActivityLog from '../brain/BrainActivityLog.svelte';
	import KbBrainsPanel from './KbBrainsPanel.svelte';
	import KbInterviewPanel from './KbInterviewPanel.svelte';
	import KbSettingsPanel from './KbSettingsPanel.svelte';
	import KnowledgeBaseSharePanel from './KnowledgeBaseSharePanel.svelte';
	import ReviewPanel from '../brain/review/ReviewPanel.svelte';
	import SourcesPanel from '../brain/SourcesPanel.svelte';
	import type { ChatbotSummary } from '$lib/data/chatbotTypes';
	import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type { KbSectionKey } from './kbRail';
	import type { KbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';
	import type { KnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
	import type { KnowledgeBaseShare } from '$lib/server/knowledge/knowledgeBaseShares';
	import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

	let {
		section,
		knowledgeBase,
		isOwner,
		brains,
		processMaps,
		shares,
		chatbots,
		workbench,
		onOutOfCredits
	}: {
		section: KbSectionKey;
		knowledgeBase: KnowledgeBase;
		isOwner: boolean;
		brains: KbBrainSummary[];
		processMaps: ProcessMapSummary[];
		shares: KnowledgeBaseShare[];
		chatbots: ChatbotSummary[];
		workbench: KbWorkbenchData;
		onOutOfCredits: () => void;
	} = $props();

	const primaryBrain = $derived(workbench.primaryBrain);
	const needsExpertise = $derived(
		primaryBrain === null &&
			['documents', 'review', 'api', 'log'].includes(section)
	);
	const pageBasePath = $derived(
		primaryBrain === null ? '' : `/workspace/${primaryBrain.entityId}/domains/${primaryBrain.id}`
	);
</script>

{#if needsExpertise}
	<p class="p-5 text-sm text-chalk/50">
		Add an Expertise Brain first — this section wakes up once the knowledge base has one.
	</p>
{:else if section === 'interview'}
	<div class="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
		<KbInterviewPanel knowledgeBaseId={knowledgeBase.id} />
	</div>
{:else if section === 'brains'}
	<KbBrainsPanel knowledgeBaseId={knowledgeBase.id} {brains} {processMaps} />
{:else if section === 'documents' && primaryBrain !== null}
	<div class="min-h-0 flex-1 overflow-y-auto">
		<SourcesPanel brainId={primaryBrain.id} {isOwner} sources={workbench.sources} {onOutOfCredits} />
	</div>
{:else if section === 'review' && primaryBrain !== null}
	<ReviewPanel brainId={primaryBrain.id} proposals={workbench.proposals} />
{:else if section === 'share'}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<KnowledgeBaseSharePanel {shares} />
	</div>
{:else if section === 'chatbots'}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<ChatbotsPanel {chatbots} />
	</div>
{:else if section === 'api' && primaryBrain !== null}
	<div class="min-h-0 flex-1 overflow-y-auto">
		<ApiPanel brainId={primaryBrain.id} tokens={workbench.apiTokens} />
	</div>
{:else if section === 'log' && primaryBrain !== null}
	<div class="min-h-0 flex-1 overflow-y-auto">
		<BrainActivityLog events={workbench.events} {pageBasePath} />
	</div>
{:else if section === 'settings'}
	<KbSettingsPanel {knowledgeBase} />
{/if}
