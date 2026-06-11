<script lang="ts">
	import TaskFlowList from './TaskFlowList.svelte';
	import type { StationSelection } from './stationSelection';

	let { selection }: { selection: StationSelection | null } = $props();
</script>

{#if selection === null}
	<aside
		class="flex items-center justify-center rounded-2xl border-2 border-dashed border-map-ink/20
			p-8 text-center text-map-ink/60"
	>
		<p>
			Select any station to see the task behind it — what it needs to start, what it hands on, and
			where it crosses another role.
		</p>
	</aside>
{:else}
	<aside class="flex flex-col gap-4 rounded-2xl border border-map-grid p-6 shadow-sm">
		<div class="h-2.5 rounded-full" style={`background-color: ${selection.line.colour}`}></div>
		<div>
			<p class="font-display text-xs tracking-widest text-map-ink/60 uppercase">
				{selection.line.role} line
			</p>
			<h2 class="font-display text-2xl">{selection.station.name}</h2>
		</div>
		<p class="text-map-ink/80">{selection.station.task.summary}</p>
		<TaskFlowList title="Inputs" items={selection.station.task.inputs} />
		<TaskFlowList title="Outputs" items={selection.station.task.outputs} />
		{#if selection.station.isInterchange}
			<p class="border-t border-map-grid pt-3 text-sm text-map-ink/60">
				Interchange — this stop connects with the {selection.station.connectingRoles.join(' and ')}
				line.
			</p>
		{/if}
	</aside>
{/if}
