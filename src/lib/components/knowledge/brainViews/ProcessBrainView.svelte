<script lang="ts">
	import FlowBrain from '../../brain/FlowBrain.svelte';
	import LineLegend from '../../map/LineLegend.svelte';
	import ProcessMapOverlay from './ProcessMapOverlay.svelte';
	import ShareMapPanel from '../../workspace/ShareMapPanel.svelte';
	import StationDetailPanel from '../../map/StationDetailPanel.svelte';
	import WorkspaceChat from '../../workspace/WorkspaceChat.svelte';
	import { brainToolKeysFor, brainTools, brainToolsOwnerFor } from './brainViewTools';
	import { layoutWorkflowMap } from '$lib/data/mapLayout';
	import { brainToolsRank, useDashboardTools } from '../dashboard/dashboardTools.svelte';
	import { brainHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import type { ProcessBrainView } from '$lib/server/knowledge/brainViews/loadProcessBrainView';
	import type { StationSelection } from '../../map/stationSelection';
	import type { WorkflowModel } from '$lib/data/workflowModel';

	let {
		knowledgeBaseId,
		isOwner,
		creditBalance,
		view
	}: {
		knowledgeBaseId: string;
		isOwner: boolean;
		creditBalance: number | null;
		view: ProcessBrainView;
	} = $props();

	const dashboardTools = useDashboardTools();
	const actionBasePath = $derived(brainHref(knowledgeBaseId, view.workflowId));
	const toolKeys = $derived(brainToolKeysFor(['interview', 'map'], 'share', isOwner));

	let model: WorkflowModel = $derived(view.latestMap);
	let selection = $state<StationSelection | null>(null);
	let isMapShown = $state(false);

	const legendLines = $derived(layoutWorkflowMap(model).lines);

	$effect(() => {
		const toolsOwner = brainToolsOwnerFor('process');
		const tools = brainTools(toolKeys, { interview, map, share });
		dashboardTools.register(toolsOwner, tools, brainToolsRank);
		return () => dashboardTools.release(toolsOwner);
	});

	$effect(() => {
		if (dashboardTools.activeKey === 'map') isMapShown = true;
	});

	function closeMap(): void {
		isMapShown = false;
		if (dashboardTools.activeKey === 'map') dashboardTools.close();
	}
</script>

{#snippet interview()}
	<WorkspaceChat
		workflowId={view.workflowId}
		initialMessages={view.messages}
		onMapUpdate={(updatedModel) => (model = updatedModel)}
		frame="panel"
	/>
{/snippet}

{#snippet map()}
	<div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
		<LineLegend lines={legendLines} />
		<StationDetailPanel {selection} />
	</div>
{/snippet}

{#snippet share()}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<ShareMapPanel viewers={view.viewers} {actionBasePath} />
	</div>
{/snippet}

<FlowBrain {model} seed={view.workflowId} />
{#if isMapShown}
	<ProcessMapOverlay
		{model}
		{selection}
		{creditBalance}
		onSelectStation={(chosen) => (selection = chosen)}
		onClose={closeMap}
	/>
{/if}
