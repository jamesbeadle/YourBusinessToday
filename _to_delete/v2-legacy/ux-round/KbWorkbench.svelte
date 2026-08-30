<script lang="ts">
	import ApiPanel from '../brain/dashboard/ApiPanel.svelte';
	import BrainActivityLog from '../brain/BrainActivityLog.svelte';
	import HiveMindPanel from '../brain/dashboard/HiveMindPanel.svelte';
	import KbInterviewPanel from './KbInterviewPanel.svelte';
	import KbWorkbenchSection from './KbWorkbenchSection.svelte';
	import OutOfCreditsNotice from '../workspace/OutOfCreditsNotice.svelte';
	import ReviewPanel from '../brain/review/ReviewPanel.svelte';
	import SellPanel from '../brain/dashboard/SellPanel.svelte';
	import SourcesPanel from '../brain/SourcesPanel.svelte';
	import type { KbWorkbenchData } from '$lib/server/knowledge/kbWorkbenchData';

	let {
		knowledgeBaseId,
		isOwner,
		workbench
	}: { knowledgeBaseId: string; isOwner: boolean; workbench: KbWorkbenchData } = $props();

	let isOutOfCredits = $state(false);

	const primaryBrain = $derived(workbench.primaryBrain);
	const pageBasePath = $derived(
		primaryBrain === null ? '' : `/workspace/${primaryBrain.entityId}/domains/${primaryBrain.id}`
	);
</script>

{#if isOutOfCredits}
	<OutOfCreditsNotice />
{/if}

<KbWorkbenchSection title="The interview" isOpen={true}>
	<KbInterviewPanel {knowledgeBaseId} />
</KbWorkbenchSection>

{#if primaryBrain === null}
	<p class="rounded-2xl border border-dashed border-hairline p-6 text-center text-sm text-chalk/50">
		Add an Expertise Brain to unlock documents, review, the marketplace, Trade Talk, and API
		access for this knowledge base.
	</p>
{:else}
	<KbWorkbenchSection title="Source documents" isOpen={true}>
		<p class="text-sm text-chalk/60">
			Drop in what the business already has — the knowledge base reads each document once and
			files what it learns into the right brains.
		</p>
		<SourcesPanel
			brainId={primaryBrain.id}
			{isOwner}
			sources={workbench.sources}
			onOutOfCredits={() => (isOutOfCredits = true)}
		/>
	</KbWorkbenchSection>
	{#if isOwner}
		<KbWorkbenchSection title="Review changes" badgeCount={workbench.proposals.length}>
			<ReviewPanel brainId={primaryBrain.id} proposals={workbench.proposals} />
		</KbWorkbenchSection>
		<KbWorkbenchSection title="Sell on the marketplace">
			<SellPanel
				brainId={primaryBrain.id}
				listing={workbench.listing}
				editions={workbench.editions}
				sales={workbench.sales}
			/>
		</KbWorkbenchSection>
		{#if workbench.hive !== null}
			<KbWorkbenchSection title="Trade Talk">
				<HiveMindPanel hive={workbench.hive} />
			</KbWorkbenchSection>
		{/if}
		<KbWorkbenchSection title="API access">
			<ApiPanel brainId={primaryBrain.id} tokens={workbench.apiTokens} />
		</KbWorkbenchSection>
	{/if}
	<KbWorkbenchSection title="The log">
		<BrainActivityLog events={workbench.events} {pageBasePath} />
	</KbWorkbenchSection>
{/if}
