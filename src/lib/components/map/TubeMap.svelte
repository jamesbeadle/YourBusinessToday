<script lang="ts">
	import { mapViewBox, workflowLines } from '$lib/data/workflowMap';
	import type { RoleLine, Station } from '$lib/data/types';
	import MapStation from './MapStation.svelte';
	import TubeLinePath from './TubeLinePath.svelte';

	let {
		selectedStationId,
		onSelectStation
	}: {
		selectedStationId: string | null;
		onSelectStation: (line: RoleLine, station: Station) => void;
	} = $props();
</script>

<svg
	viewBox={`0 0 ${mapViewBox.width} ${mapViewBox.height}`}
	role="img"
	aria-label="Workflow map of every role and task"
	class="w-full rounded-2xl border border-map-grid bg-map-paper shadow-sm"
>
	{#each workflowLines as line (line.id)}
		<TubeLinePath {line} />
	{/each}
	{#each workflowLines as line (line.id)}
		{#each line.stations as station (station.id)}
			<MapStation
				{line}
				{station}
				isSelected={selectedStationId === station.id}
				onSelect={() => onSelectStation(line, station)}
			/>
		{/each}
	{/each}
</svg>
