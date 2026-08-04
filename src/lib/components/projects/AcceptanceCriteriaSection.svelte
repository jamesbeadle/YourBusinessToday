<script lang="ts">
	import { enhance } from '$app/forms';
	import CriterionRow from './CriterionRow.svelte';
	import type { AcceptanceCriterion } from '$lib/server/projects/criterionRecord';

	let { criteria }: { criteria: AcceptanceCriterion[] } = $props();

	const metCount = $derived(criteria.filter((criterion) => criterion.isMet).length);
</script>

<section class="flex flex-col gap-3">
	<div class="flex items-baseline justify-between">
		<h2 class="font-display text-xl font-medium">Acceptance criteria</h2>
		{#if criteria.length > 0}
			<span class="font-display text-sm text-chalk/50">{metCount} of {criteria.length} met</span>
		{/if}
	</div>
	{#if criteria.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			No acceptance criteria yet — add what must be true for this story to be done.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each criteria as criterion (criterion.id)}
				<CriterionRow {criterion} />
			{/each}
		</ul>
	{/if}
	<form method="POST" action="?/addCriterion" use:enhance class="flex items-center gap-3">
		<input
			name="description"
			required
			placeholder="Add an acceptance criterion"
			class="flex-1 rounded-full border border-hairline bg-carriage px-5 py-2.5 text-chalk
				outline-none focus:border-go"
		/>
		<button
			type="submit"
			class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Add
		</button>
	</form>
</section>
