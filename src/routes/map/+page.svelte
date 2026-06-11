<script lang="ts">
	import LineLegend from '$lib/components/map/LineLegend.svelte';
	import StationDetailPanel from '$lib/components/map/StationDetailPanel.svelte';
	import type { StationSelection } from '$lib/components/map/stationSelection';
	import TubeMap from '$lib/components/map/TubeMap.svelte';
	import type { RoleLine, Station } from '$lib/data/types';

	let selection = $state<StationSelection | null>(null);

	const selectedStationId = $derived(selection === null ? null : selection.station.id);

	function selectStation(line: RoleLine, station: Station) {
		selection = { line, station };
	}
</script>

<svelte:head>
	<title>The Workflow Map — Your Business Today</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-10">
	<header class="flex flex-col gap-2">
		<p class="font-display text-sm tracking-widest text-tfl-red uppercase">Demo</p>
		<h1 class="font-display text-3xl">The Workflow Map</h1>
		<p class="max-w-prose text-map-ink/80">
			A sample business, mapped. Each line is a role, each station is a task with defined inputs
			and outputs, and each interchange is a handover between roles. Click a station to inspect
			it.
		</p>
	</header>
	<div class="mt-6">
		<LineLegend />
	</div>
	<div class="mt-6 grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
		<TubeMap {selectedStationId} onSelectStation={selectStation} />
		<StationDetailPanel {selection} />
	</div>
</div>
