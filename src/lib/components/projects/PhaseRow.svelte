<script lang="ts">
	import PhaseProgressBar from './PhaseProgressBar.svelte';
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';

	let {
		phaseSummary,
		onDelete
	}: { phaseSummary: PhaseSummary; onDelete: (phaseSummary: PhaseSummary) => void } = $props();
</script>

<li class="flex items-center gap-4">
	<span class="w-40 truncate font-display text-sm">{phaseSummary.name}</span>
	<span class="w-14 text-xs whitespace-nowrap text-chalk/50">
		{phaseSummary.taskCount} tasks
	</span>
	<div class="flex-1">
		<PhaseProgressBar completionPercent={phaseSummary.completionPercent} />
	</div>
	<button
		type="button"
		onclick={() => onDelete(phaseSummary)}
		aria-label={`Delete phase ${phaseSummary.name}`}
		class="px-1 text-chalk/40 transition hover:text-signal"
	>
		✕
	</button>
</li>
