<script lang="ts">
	import { workflowLines } from '$lib/data/workflowMap';

	const roleCount = workflowLines.length;
	const allStations = workflowLines.flatMap((line) => line.stations);
	const stationCount = allStations.length;
	const outputCount = allStations.filter((station) => station.producesOutput).length;
	const projectFacts = [
		`${roleCount} roles`,
		`${stationCount} stations`,
		`${outputCount} business outputs`
	];
</script>

<header class="flex flex-col gap-3">
	<p class="font-display text-sm tracking-widest text-tfl-red uppercase">Projects · Demo</p>
	<div class="flex flex-wrap items-center gap-4">
		<h1 class="font-display text-3xl">Jewel Bespoke Build</h1>
		<ul class="flex flex-wrap gap-2">
			{#each projectFacts as projectFact}
				<li class="rounded-full border border-map-grid px-3 py-1 text-xs text-map-ink/70">
					{projectFact}
				</li>
			{/each}
		</ul>
	</div>
	<p class="max-w-prose text-map-ink/80">
		Surrey super-prime residential construction. The map below is everything the agent has learned
		about this business so far — keep talking and it keeps growing. Select a station to inspect
		its task and bring it into the conversation.
	</p>
</header>
