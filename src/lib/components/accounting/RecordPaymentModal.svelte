<script lang="ts">
	import FormField from './FormField.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { toIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { inputClasses } from './accountingFormStyles';

	let { isOpen = $bindable(), outstanding }: { isOpen: boolean; outstanding: number } = $props();

	const tracker = new FormTracker();
	const closeModal = () => (isOpen = false);
</script>

<Modal title="Record payment" bind:isOpen>
	<form method="POST" action="?/recordPayment" use:enhance={tracker.submit(closeModal)} class="flex flex-col gap-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField label="Paid on">
				<input name="paidOn" type="date" required value={toIsoDate(new Date())} class={inputClasses} />
			</FormField>
			<FormField label="Amount">
				<input
					name="amount"
					type="number"
					step="0.01"
					min="0.01"
					max={outstanding}
					required
					value={outstanding}
					class={inputClasses}
				/>
			</FormField>
		</div>
		<p class="text-xs text-chalk/50">Posts bank in, trade debtors down. A part payment leaves the invoice issued.</p>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex justify-end">
			<SubmitButton isSaving={tracker.isSaving} savingLabel="Recording…">Record</SubmitButton>
		</div>
	</form>
</Modal>
