<script lang="ts">
	import LineLegend from '$lib/components/map/LineLegend.svelte';
	import ProjectChat from '$lib/components/chat/ProjectChat.svelte';
	import ProjectHeader from '$lib/components/project/ProjectHeader.svelte';
	import StationDetailPanel from '$lib/components/map/StationDetailPanel.svelte';
	import TubeMap from '$lib/components/map/TubeMap.svelte';
	import type { StationSelection } from '$lib/components/map/stationSelection';
	import type { RoleLine, Station } from '$lib/data/types';

	let selection = $state<StationSelection | null>(null);

	const selectedStationId = $derived(selection === null ? null : selection.station.id);

	function selectStation(line: RoleLine, station: Station) {
		selection = { line, station };
	}
</script>

<svelte:head>
	<title>Jewel Bespoke Build — Your Business Today</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-10">
	<ProjectHeader />
	<div class="mt-6">
		<LineLegend />
	</div>
	<div class="mt-6 grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
		<TubeMap {selectedStationId} onSelectStation={selectStation} />
		<StationDetailPanel {selection} />
	</div>
</div>

<ProjectChat contextSelection={selection} />
