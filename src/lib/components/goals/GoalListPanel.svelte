<script lang="ts">
	import AddGoalForm from './AddGoalForm.svelte';
	import GoalRow from './GoalRow.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import type { GoalSummary } from '$lib/server/goals/getGoalSummaries';

	let { goalSummaries }: { goalSummaries: GoalSummary[] } = $props();

	let isAddGoalModalOpen = $state(false);
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex items-center justify-between">
		<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Goals</h2>
		<button
			type="button"
			onclick={() => (isAddGoalModalOpen = true)}
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Add goal
		</button>
	</div>
	{#if goalSummaries.length === 0}
		<p class="text-sm text-chalk/60">
			No goals yet — a goal is what the project must achieve, with a measure both sides can check.
		</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each goalSummaries as goalSummary (goalSummary.id)}
				<GoalRow {goalSummary} />
			{/each}
		</ul>
	{/if}
</section>

<Modal title="Add goal" bind:isOpen={isAddGoalModalOpen}>
	<AddGoalForm onCreated={() => (isAddGoalModalOpen = false)} />
</Modal>
