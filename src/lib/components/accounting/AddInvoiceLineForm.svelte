<script lang="ts">
	import InvoiceLineFields from './InvoiceLineFields.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { confirmButtonClasses } from './accountingFormStyles';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

	let { incomeAccounts, costCentres }: { incomeAccounts: LedgerAccount[]; costCentres: CostCentre[] } =
		$props();

	const tracker = new FormTracker();
</script>

<form
	method="POST"
	action="?/addLine"
	use:enhance={tracker.submit()}
	class="flex flex-col gap-3 rounded-xl border border-dashed border-hairline p-4"
>
	<p class="font-display text-sm text-chalk/60">Add a line</p>
	<InvoiceLineFields {incomeAccounts} {costCentres} />
	<FormErrorNote message={tracker.errorMessage} />
	<div class="flex justify-end">
		<SubmitButton isSaving={tracker.isSaving} savingLabel="Adding…" class={confirmButtonClasses}>
			Add line
		</SubmitButton>
	</div>
</form>
