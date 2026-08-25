<script lang="ts">
	import AccountSelect from './AccountSelect.svelte';
	import CostCentreSelect from './CostCentreSelect.svelte';
	import FormField from './FormField.svelte';
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
		expenseAccounts,
		costCentres
	}: { isOpen: boolean; expenseAccounts: LedgerAccount[]; costCentres: CostCentre[] } = $props();

	const tracker = new FormTracker();
	const closeModal = () => (isOpen = false);
</script>

<Modal title="Record expense" bind:isOpen>
	<form method="POST" action="?/recordExpense" use:enhance={tracker.submit(closeModal)} class="flex flex-col gap-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField label="Date">
				<input name="expenseDate" type="date" required value={toIsoDate(new Date())} class={inputClasses} />
			</FormField>
			<FormField label="Amount">
				<input name="amount" type="number" step="0.01" min="0.01" required class={inputClasses} />
			</FormField>
		</div>
		<FormField label="Supplier">
			<input name="supplier" required class={inputClasses} />
		</FormField>
		<FormField label="Description (optional)">
			<input name="description" class={inputClasses} />
		</FormField>
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField label="Account">
				<AccountSelect name="expenseAccountId" accounts={expenseAccounts} />
			</FormField>
			<FormField label="Cost centre">
				<CostCentreSelect {costCentres} />
			</FormField>
		</div>
		<label class="flex items-center gap-3 text-sm text-chalk/70">
			<input type="checkbox" name="isPaid" value="true" checked class="h-4 w-4 accent-go" />
			Already paid from the bank (untick to hold it in trade creditors)
		</label>
		<p class="text-xs text-chalk/50">
			To prepay something, post it to Prepayments and release it monthly from Journals.
		</p>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex justify-end">
			<SubmitButton isSaving={tracker.isSaving} savingLabel="Posting…">Record</SubmitButton>
		</div>
	</form>
</Modal>
