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

<Modal title="Release a prepayment" bind:isOpen>
	<form method="POST" action="?/createPrepaymentRelease" use:enhance={tracker.submit(closeModal)} class="flex flex-col gap-4">
		<p class="text-sm text-chalk/60">
			For something paid up front that covers several months (record the payment as an expense
			against Prepayments first). Posts one journal per month moving a share into the expense
			account.
		</p>
		<div class="grid gap-4 sm:grid-cols-3">
			<FormField label="First month">
				<input name="firstMonthKey" type="month" required value={currentMonthKey()} class={inputClasses} />
			</FormField>
			<FormField label="Months">
				<input name="monthCount" type="number" min="1" max="36" required value="12" class={inputClasses} />
			</FormField>
			<FormField label="Total amount">
				<input name="totalAmount" type="number" step="0.01" min="0.01" required class={inputClasses} />
			</FormField>
		</div>
		<FormField label="Description">
			<input name="description" required placeholder="e.g. Annual insurance" class={inputClasses} />
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
			<SubmitButton isSaving={tracker.isSaving} savingLabel="Posting…">Post releases</SubmitButton>
		</div>
	</form>
</Modal>
