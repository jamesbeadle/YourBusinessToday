<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';

	type PhaseChoice = { id: string | null; name: string };

	let {
		taskId,
		taskTitle,
		currentPhaseId,
		phaseSummaries,
		isOpen = $bindable()
	}: {
		taskId: string;
		taskTitle: string;
		currentPhaseId: string | null;
		phaseSummaries: PhaseSummary[];
		isOpen: boolean;
	} = $props();

	const tracker = new FormTracker();
	const noPhaseChoice: PhaseChoice = { id: null, name: 'No phase' };
	const phaseChoices: PhaseChoice[] = $derived([...phaseSummaries, noPhaseChoice]);

	$effect(() => {
		if (!isOpen) tracker.reset();
	});

	function optionClasses(phaseId: string | null): string {
		if (phaseId === currentPhaseId) return 'border-go bg-go/10 text-go';
		return 'border-hairline text-chalk/80 hover:border-go hover:text-go';
	}
</script>

<Modal title="Change phase" bind:isOpen>
	<div class="flex flex-col gap-4">
		<p class="text-sm text-chalk/60">{taskTitle}</p>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex flex-col gap-2" class:animate-pulse={tracker.isSaving}>
			{#each phaseChoices as phaseChoice (phaseChoice.id ?? 'no-phase')}
				<form method="POST" action="?/setPhase" use:enhance={tracker.submit(() => (isOpen = false))}>
					<input type="hidden" name="taskId" value={taskId} />
					<input type="hidden" name="phaseId" value={phaseChoice.id ?? ''} />
					<button
						type="submit"
						disabled={phaseChoice.id === currentPhaseId || tracker.isSaving}
						class={`w-full rounded-xl border px-4 py-3 text-left font-display text-sm transition
							disabled:cursor-default ${optionClasses(phaseChoice.id)}`}
					>
						{phaseChoice.name}
						{#if phaseChoice.id === currentPhaseId}
							<span class="ml-2 text-xs text-chalk/50">current</span>
						{/if}
					</button>
				</form>
			{/each}
		</div>
	</div>
</Modal>
