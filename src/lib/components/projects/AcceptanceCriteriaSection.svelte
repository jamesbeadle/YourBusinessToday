<script lang="ts">
	import { enhance } from '$app/forms';
	import CriterionRow from './CriterionRow.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import type { AcceptanceCriterion } from '$lib/server/projects/criterionRecord';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { criteria }: { criteria: AcceptanceCriterion[] } = $props();

	let isAddModalOpen = $state(false);

	const metCount = $derived(criteria.filter((criterion) => criterion.isMet).length);

	const closeWhenAdded: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();
			if (result.type === 'success') isAddModalOpen = false;
		};
	};
</script>

<section class="flex flex-col gap-3">
	<div class="flex items-center justify-between gap-4">
		<div class="flex items-baseline gap-3">
			<h2 class="font-display text-xl font-medium">Acceptance criteria</h2>
			{#if criteria.length > 0}
				<span class="font-display text-sm text-chalk/50">{metCount} of {criteria.length} met</span>
			{/if}
		</div>
		<button
			type="button"
			onclick={() => (isAddModalOpen = true)}
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Add criterion
		</button>
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
</section>

<Modal title="Add acceptance criterion" bind:isOpen={isAddModalOpen}>
	<form method="POST" action="?/addCriterion" use:enhance={closeWhenAdded} class="flex flex-col gap-4">
		<label class="flex flex-col gap-1">
			<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Criterion</span>
			<input
				name="description"
				required
				placeholder="What must be true for this story to be done"
				class="rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
					focus:border-go"
			/>
		</label>
		<button
			type="submit"
			class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Add
		</button>
	</form>
</Modal>
