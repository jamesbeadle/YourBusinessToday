<script lang="ts">
	import ApiPanel from '../../brain/dashboard/ApiPanel.svelte';
	import BrainActivityLog from '../../brain/BrainActivityLog.svelte';
	import ReviewPanel from '../../brain/review/ReviewPanel.svelte';
	import SourcesPanel from '../../brain/SourcesPanel.svelte';
	import type { ExpertiseWorkbenchTool } from './knowledgeBaseTools';
	import type { KbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';

	let {
		tool,
		isOwner,
		workbench,
		onOutOfCredits
	}: {
		tool: ExpertiseWorkbenchTool;
		isOwner: boolean;
		workbench: KbWorkbenchData;
		onOutOfCredits: () => void;
	} = $props();

	const primaryBrain = $derived(workbench.primaryBrain);
	const pageBasePath = $derived(
		primaryBrain === null ? '' : `/workspace/${primaryBrain.entityId}/domains/${primaryBrain.id}`
	);
</script>

{#if primaryBrain === null}
	<p class="p-5 text-sm text-chalk/50">
		Add an Expertise Brain first — this tool wakes up once the knowledge base has one.
	</p>
{:else if tool === 'review'}
	<ReviewPanel brainId={primaryBrain.id} proposals={workbench.proposals} />
{:else}
	<div class="min-h-0 flex-1 overflow-y-auto">
		{#if tool === 'documents'}
			<SourcesPanel brainId={primaryBrain.id} {isOwner} sources={workbench.sources} {onOutOfCredits} />
		{:else if tool === 'api'}
			<ApiPanel brainId={primaryBrain.id} tokens={workbench.apiTokens} />
		{:else}
			<BrainActivityLog events={workbench.events} {pageBasePath} />
		{/if}
	</div>
{/if}
