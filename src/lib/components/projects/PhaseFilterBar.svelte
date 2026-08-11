<script lang="ts">
	import { filterChipClasses } from './filterChipClasses';
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';

	let {
		phaseSummaries,
		selectedPhaseId = $bindable()
	}: { phaseSummaries: PhaseSummary[]; selectedPhaseId: string } = $props();
</script>

<div class="flex flex-wrap items-center gap-2">
	<span class="font-display text-xs tracking-widest text-chalk/50 uppercase">Phase</span>
	<button
		type="button"
		onclick={() => (selectedPhaseId = 'all')}
		class={filterChipClasses(selectedPhaseId === 'all')}
	>
		All
	</button>
	{#each phaseSummaries as phaseSummary (phaseSummary.id)}
		<button
			type="button"
			onclick={() => (selectedPhaseId = phaseSummary.id)}
			class={filterChipClasses(selectedPhaseId === phaseSummary.id)}
		>
			{phaseSummary.name}
		</button>
	{/each}
	<button
		type="button"
		onclick={() => (selectedPhaseId = 'none')}
		class={filterChipClasses(selectedPhaseId === 'none')}
	>
		No phase
	</button>
</div>
