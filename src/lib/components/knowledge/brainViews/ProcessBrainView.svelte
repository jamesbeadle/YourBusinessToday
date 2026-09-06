<script lang="ts">
	import FlowBrain from '../../brain/FlowBrain.svelte';
	import LineLegend from '../../map/LineLegend.svelte';
	import ProcessMapOverlay from './ProcessMapOverlay.svelte';
	import ShareMapPanel from '../../workspace/ShareMapPanel.svelte';
	import StationDetailPanel from '../../map/StationDetailPanel.svelte';
	import { brainToolKeysFor, brainTools, brainToolsOwnerFor } from './brainViewTools';
	import { layoutWorkflowMap } from '$lib/data/mapLayout';
	import { useDashboardTools } from '../dashboard/dashboardTools.svelte';
	import { brainHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import type { ProcessBrainView } from '$lib/server/knowledge/brainViews/loadProcessBrainView';
	import type { StationSelection } from '../../map/stationSelection';

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

	const toolbarTools = useDashboardTools().right;
	const actionBasePath = $derived(brainHref(knowledgeBaseId, view.workflowId));
	const toolKeys = $derived(brainToolKeysFor(['map'], 'share', isOwner));

	const model = $derived(view.latestMap);
	let selection = $state<StationSelection | null>(null);
	let isMapShown = $state(false);

	const legendLines = $derived(layoutWorkflowMap(model).lines);

	$effect(() => {
		const toolsOwner = brainToolsOwnerFor('process', view.workflowId);
		const tools = brainTools(toolKeys, { map, share });
		toolbarTools.register(toolsOwner, tools);
		return () => toolbarTools.release(toolsOwner);
	});

	$effect(() => {
		if (toolbarTools.activeKey === 'map') isMapShown = true;
	});

	function closeMap(): void {
		isMapShown = false;
		if (toolbarTools.activeKey === 'map') toolbarTools.close();
	}
</script>

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
