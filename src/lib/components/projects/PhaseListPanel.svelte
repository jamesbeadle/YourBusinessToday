<script lang="ts">
	import AddPhaseForm from './AddPhaseForm.svelte';
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import PhaseRow from './PhaseRow.svelte';
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';

	let { phaseSummaries }: { phaseSummaries: PhaseSummary[] } = $props();

	let isAddPhaseModalOpen = $state(false);
	let isDeletePhaseModalOpen = $state(false);
	let phaseAwaitingDelete = $state<PhaseSummary | null>(null);

	function openDeleteModal(phaseSummary: PhaseSummary) {
		phaseAwaitingDelete = phaseSummary;
		isDeletePhaseModalOpen = true;
	}
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex items-center justify-between">
		<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Phases</h2>
		<button
			type="button"
			onclick={() => (isAddPhaseModalOpen = true)}
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Add phase
		</button>
	</div>
	{#if phaseSummaries.length === 0}
		<p class="text-sm text-chalk/60">No phases yet — add one to group the backlog into stages.</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each phaseSummaries as phaseSummary (phaseSummary.id)}
				<PhaseRow {phaseSummary} onDelete={openDeleteModal} />
			{/each}
		</ul>
	{/if}
</section>

<Modal title="Add phase" bind:isOpen={isAddPhaseModalOpen}>
	<AddPhaseForm onCreated={() => (isAddPhaseModalOpen = false)} />
</Modal>

{#if phaseAwaitingDelete !== null}
	<DangerConfirmModal
		title="Delete phase"
		description={`Delete “${phaseAwaitingDelete.name}”? Its ${phaseAwaitingDelete.taskCount} tasks are kept — they just lose the phase.`}
		action="?/deletePhase"
		fields={{ phaseId: phaseAwaitingDelete.id }}
		submitLabel="Delete phase"
		bind:isOpen={isDeletePhaseModalOpen}
	/>
{/if}
