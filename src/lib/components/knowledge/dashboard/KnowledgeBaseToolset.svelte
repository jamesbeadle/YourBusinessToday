<script lang="ts">
	import ChatbotsPanel from '../../chatbots/ChatbotsPanel.svelte';
	import ExpertiseWorkbenchPanel from './ExpertiseWorkbenchPanel.svelte';
	import KbInterviewPanel from '../KbInterviewPanel.svelte';
	import KbSettingsPanel from '../KbSettingsPanel.svelte';
	import KnowledgeBaseSharePanel from '../KnowledgeBaseSharePanel.svelte';
	import { useDashboardTools } from './dashboardTools.svelte';
	import {
		knowledgeBaseToolDefinitions,
		knowledgeBaseToolKeysFor,
		type KnowledgeBaseToolKey
	} from './knowledgeBaseTools';
	import type { Snippet } from 'svelte';
	import type { ChatbotSummary } from '$lib/data/chatbotTypes';
	import type { KbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';
	import type { KnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
	import type { KnowledgeBaseShare } from '$lib/server/knowledge/knowledgeBaseShares';

	let {
		knowledgeBase,
		isOwner,
		shares,
		chatbots,
		workbench,
		onOutOfCredits
	}: {
		knowledgeBase: KnowledgeBase;
		isOwner: boolean;
		shares: KnowledgeBaseShare[];
		chatbots: ChatbotSummary[];
		workbench: KbWorkbenchData;
		onOutOfCredits: () => void;
	} = $props();

	const toolsOwner = 'knowledge-base';
	const dashboardTools = useDashboardTools();

	const panels: Record<KnowledgeBaseToolKey, Snippet> = {
		interview: interviewPanel,
		documents: documentsPanel,
		review: reviewPanel,
		share: sharePanel,
		chatbots: chatbotsPanel,
		api: apiPanel,
		log: logPanel,
		settings: settingsPanel
	};

	$effect(() => {
		const tools = knowledgeBaseToolKeysFor(isOwner).map((key) => ({
			...knowledgeBaseToolDefinitions[key],
			panel: panels[key]
		}));
		dashboardTools.register(toolsOwner, tools);
		return () => dashboardTools.release(toolsOwner);
	});
</script>

{#snippet interviewPanel()}
	<div class="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
		<KbInterviewPanel knowledgeBaseId={knowledgeBase.id} />
	</div>
{/snippet}

{#snippet documentsPanel()}
	<ExpertiseWorkbenchPanel tool="documents" {isOwner} {workbench} {onOutOfCredits} />
{/snippet}

{#snippet reviewPanel()}
	<ExpertiseWorkbenchPanel tool="review" {isOwner} {workbench} {onOutOfCredits} />
{/snippet}

{#snippet apiPanel()}
	<ExpertiseWorkbenchPanel tool="api" {isOwner} {workbench} {onOutOfCredits} />
{/snippet}

{#snippet logPanel()}
	<ExpertiseWorkbenchPanel tool="log" {isOwner} {workbench} {onOutOfCredits} />
{/snippet}

{#snippet sharePanel()}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<KnowledgeBaseSharePanel knowledgeBaseId={knowledgeBase.id} {shares} />
	</div>
{/snippet}

{#snippet chatbotsPanel()}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<ChatbotsPanel knowledgeBaseId={knowledgeBase.id} {chatbots} />
	</div>
{/snippet}

{#snippet settingsPanel()}
	<KbSettingsPanel {knowledgeBase} />
{/snippet}
