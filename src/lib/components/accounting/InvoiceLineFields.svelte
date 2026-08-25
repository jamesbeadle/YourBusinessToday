<script lang="ts">
	import AccountSelect from './AccountSelect.svelte';
	import CostCentreSelect from './CostCentreSelect.svelte';
	import { inputClasses } from './accountingFormStyles';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import type { InvoiceLine } from '$lib/server/accounting/getInvoice';
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

	let {
		line,
		incomeAccounts,
		costCentres
	}: { line?: InvoiceLine; incomeAccounts: LedgerAccount[]; costCentres: CostCentre[] } = $props();

	const defaultIncomeAccountId = $derived(line?.incomeAccountId ?? incomeAccounts[0]?.id ?? '');
</script>

<div class="grid gap-3 sm:grid-cols-[minmax(0,3fr)_repeat(2,minmax(0,1fr))]">
	<input
		name="description"
		required
		placeholder="What you're charging for"
		value={line?.description ?? ''}
		class={inputClasses}
	/>
	<input
		name="quantity"
		type="number"
		step="0.01"
		min="0"
		placeholder="Qty"
		value={line?.quantity ?? 1}
		class={inputClasses}
	/>
	<input
		name="unitPrice"
		type="number"
		step="0.01"
		placeholder="Unit price"
		value={line?.unitPrice ?? ''}
		class={inputClasses}
	/>
</div>
<div class="grid gap-3 sm:grid-cols-2">
	<AccountSelect name="incomeAccountId" accounts={incomeAccounts} value={defaultIncomeAccountId} />
	<CostCentreSelect {costCentres} value={line?.costCentreId} />
</div>
