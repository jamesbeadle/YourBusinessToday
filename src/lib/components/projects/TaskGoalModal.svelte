<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { Goal } from '$lib/server/goals/goalRecord';

	type GoalChoice = { id: string | null; title: string };

	let {
		taskId,
		taskTitle,
		currentGoalId,
		goals,
		isOpen = $bindable()
	}: {
		taskId: string;
		taskTitle: string;
		currentGoalId: string | null;
		goals: Goal[];
		isOpen: boolean;
	} = $props();

	const tracker = new FormTracker();
	const noGoalChoice: GoalChoice = { id: null, title: 'No goal' };
	const goalChoices: GoalChoice[] = $derived([...goals, noGoalChoice]);

	$effect(() => {
		if (!isOpen) tracker.reset();
	});

	function optionClasses(goalId: string | null): string {
		if (goalId === currentGoalId) return 'border-go bg-go/10 text-go';
		return 'border-hairline text-chalk/80 hover:border-go hover:text-go';
	}
</script>

<Modal title="Change goal" bind:isOpen>
	<div class="flex flex-col gap-4">
		<p class="text-sm text-chalk/60">{taskTitle}</p>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex flex-col gap-2" class:animate-pulse={tracker.isSaving}>
			{#each goalChoices as goalChoice (goalChoice.id ?? 'no-goal')}
				<form method="POST" action="?/setGoal" use:enhance={tracker.submit(() => (isOpen = false))}>
					<input type="hidden" name="taskId" value={taskId} />
					<input type="hidden" name="goalId" value={goalChoice.id ?? ''} />
					<button
						type="submit"
						disabled={goalChoice.id === currentGoalId || tracker.isSaving}
						class={`w-full rounded-xl border px-4 py-3 text-left font-display text-sm transition
							disabled:cursor-default ${optionClasses(goalChoice.id)}`}
					>
						{goalChoice.title}
						{#if goalChoice.id === currentGoalId}
							<span class="ml-2 text-xs text-chalk/50">current</span>
						{/if}
					</button>
				</form>
			{/each}
		</div>
	</div>
</Modal>
