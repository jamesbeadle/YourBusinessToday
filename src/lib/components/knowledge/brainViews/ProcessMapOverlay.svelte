<script lang="ts">
	import TubeMap from '../../map/TubeMap.svelte';
	import WorkspaceMapNotice from '../../workspace/WorkspaceMapNotice.svelte';
	import { hasMapContent, type WorkflowModel } from '$lib/data/workflowModel';
	import { layoutWorkflowMap } from '$lib/data/mapLayout';
	import type { StationSelection } from '../../map/stationSelection';
	import type { RoleLine, Station } from '$lib/data/types';

	let {
		model,
		selection,
		creditBalance,
		onSelectStation
	}: {
		model: WorkflowModel;
		selection: StationSelection | null;
		creditBalance: number | null;
		onSelectStation: (selection: StationSelection) => void;
	} = $props();

	const layout = $derived(layoutWorkflowMap(model));
	const selectedStationId = $derived(selection === null ? null : selection.station.id);

	function selectStation(line: RoleLine, station: Station): void {
		onSelectStation({ line, station });
	}
</script>

<div class="absolute inset-0 z-10 overflow-y-auto bg-night p-4 pb-16 lg:pb-4">
	{#if hasMapContent(model)}
		<TubeMap
			lines={layout.lines}
			viewBox={layout.viewBox}
			{selectedStationId}
			onSelectStation={selectStation}
		/>
	{:else}
		<WorkspaceMapNotice {creditBalance} />
	{/if}
</div>
