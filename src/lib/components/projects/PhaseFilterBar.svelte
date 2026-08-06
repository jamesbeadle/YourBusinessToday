<script lang="ts">
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';

	let {
		phaseSummaries,
		selectedPhaseId = $bindable()
	}: { phaseSummaries: PhaseSummary[]; selectedPhaseId: string } = $props();

	const chipClasses = (isSelected: boolean) =>
		`rounded-full border px-4 py-1.5 font-display text-xs transition ${
			isSelected
				? 'border-go bg-go/10 text-go'
				: 'border-hairline text-chalk/60 hover:border-chalk/40 hover:text-chalk'
		}`;
</script>

<div class="flex flex-wrap items-center gap-2">
	<span class="font-display text-xs tracking-widest text-chalk/50 uppercase">Phase</span>
	<button
		type="button"
		onclick={() => (selectedPhaseId = 'all')}
		class={chipClasses(selectedPhaseId === 'all')}
	>
		All
	</button>
	{#each phaseSummaries as phaseSummary (phaseSummary.id)}
		<button
			type="button"
			onclick={() => (selectedPhaseId = phaseSummary.id)}
			class={chipClasses(selectedPhaseId === phaseSummary.id)}
		>
			{phaseSummary.name}
		</button>
	{/each}
	<button
		type="button"
		onclick={() => (selectedPhaseId = 'none')}
		class={chipClasses(selectedPhaseId === 'none')}
	>
		No phase
	</button>
</div>
