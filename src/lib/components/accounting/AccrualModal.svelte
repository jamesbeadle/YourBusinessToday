<script lang="ts">
	import AccountSelect from './AccountSelect.svelte';
	import CostCentreSelect from './CostCentreSelect.svelte';
	import FormField from './FormField.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { currentMonthKey } from '$lib/data/accounting/accountingPeriods';
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

<Modal title="Accrue an expense" bind:isOpen>
	<form method="POST" action="?/createAccrual" use:enhance={tracker.submit(closeModal)} class="flex flex-col gap-4">
		<p class="text-sm text-chalk/60">
			For a cost incurred this month but not yet billed. Posts the expense at month end and
			reverses it on the first of next month, so the real bill lands cleanly when it arrives.
		</p>
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField label="Month">
				<input name="monthKey" type="month" required value={currentMonthKey()} class={inputClasses} />
			</FormField>
			<FormField label="Amount">
				<input name="amount" type="number" step="0.01" min="0.01" required class={inputClasses} />
			</FormField>
		</div>
		<FormField label="Description">
			<input name="description" required placeholder="e.g. Accountant's fees for August" class={inputClasses} />
		</FormField>
		<div class="grid gap-4 sm:grid-cols-2">
			<FormField label="Expense account">
				<AccountSelect name="expenseAccountId" accounts={expenseAccounts} />
			</FormField>
			<FormField label="Cost centre">
				<CostCentreSelect {costCentres} />
			</FormField>
		</div>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex justify-end">
			<SubmitButton isSaving={tracker.isSaving} savingLabel="Posting…">Post accrual</SubmitButton>
		</div>
	</form>
</Modal>
