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
		<h1 class="font-display text-3xl">The Workflow Map — Jewel Bespoke Build</h1>
		<p class="max-w-prose text-map-ink/80">
			A real business, mapped: a Surrey super-prime residential builder. Six roles run in
			parallel; their lines branch and cross where one workflow feeds another — the compliance
			gate before any work order, the H&S gate before a site opens, site progress feeding the
			QS valuation. The yellow rings mark the outputs the whole system exists to produce. Click
			any station to inspect its task.
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
