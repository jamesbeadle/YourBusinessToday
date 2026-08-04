<script lang="ts">
	import { enhance } from '$app/forms';
	import PhaseProgressBar from './PhaseProgressBar.svelte';
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';

	let { phaseSummaries }: { phaseSummaries: PhaseSummary[] } = $props();
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6">
	<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Phases</h2>
	{#if phaseSummaries.length === 0}
		<p class="text-sm text-chalk/60">No phases yet — add one to group the backlog into stages.</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each phaseSummaries as phaseSummary (phaseSummary.id)}
				<li class="flex items-center gap-4">
					<span class="w-40 truncate font-display text-sm">{phaseSummary.name}</span>
					<span class="w-14 text-xs whitespace-nowrap text-chalk/50">
						{phaseSummary.taskCount} tasks
					</span>
					<div class="flex-1">
						<PhaseProgressBar completionPercent={phaseSummary.completionPercent} />
					</div>
					<form method="POST" action="?/deletePhase" use:enhance>
						<input type="hidden" name="phaseId" value={phaseSummary.id} />
						<button
							type="submit"
							aria-label={`Delete phase ${phaseSummary.name}`}
							class="px-1 text-chalk/40 transition hover:text-signal"
						>
							✕
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
	<form method="POST" action="?/createPhase" use:enhance class="flex items-center gap-3">
		<input
			name="name"
			required
			placeholder="Add a phase"
			class="flex-1 rounded-full border border-hairline bg-night px-4 py-2 text-sm text-chalk
				outline-none focus:border-go"
		/>
		<button
			type="submit"
			class="rounded-full border border-hairline px-5 py-2 font-display text-xs text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Add phase
		</button>
	</form>
</section>
