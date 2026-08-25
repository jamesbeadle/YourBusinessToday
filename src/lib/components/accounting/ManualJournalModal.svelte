<script lang="ts">
	import FormField from './FormField.svelte';
	import JournalLineInputs from './JournalLineInputs.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { toIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { inputClasses } from './accountingFormStyles';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

	let {
		isOpen = $bindable(),
		accounts,
		costCentres
	}: { isOpen: boolean; accounts: LedgerAccount[]; costCentres: CostCentre[] } = $props();

	const tracker = new FormTracker();
	const closeModal = () => (isOpen = false);
	const lineSlots = [0, 1, 2, 3, 4, 5];
</script>

<Modal title="Manual journal" bind:isOpen maxWidthClass="max-w-3xl">
	<form method="POST" action="?/createManualJournal" use:enhance={tracker.submit(closeModal)} class="flex flex-col gap-4">
		<div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
			<FormField label="Date">
				<input name="journalDate" type="date" required value={toIsoDate(new Date())} class={inputClasses} />
			</FormField>
			<FormField label="Description">
				<input name="description" required class={inputClasses} />
			</FormField>
		</div>
		<div class="flex flex-col gap-2">
			<p class="text-sm text-chalk/70">Lines — debits must equal credits</p>
			{#each lineSlots as slotIndex (slotIndex)}
				<JournalLineInputs {slotIndex} {accounts} {costCentres} />
			{/each}
		</div>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex justify-end">
			<SubmitButton isSaving={tracker.isSaving} savingLabel="Posting…">Post journal</SubmitButton>
		</div>
	</form>
</Modal>
