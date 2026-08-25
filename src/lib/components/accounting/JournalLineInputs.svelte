<script lang="ts">
	import AccountSelect from './AccountSelect.svelte';
	import CostCentreSelect from './CostCentreSelect.svelte';
	import { inputClasses } from './accountingFormStyles';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

	let {
		slotIndex,
		accounts,
		costCentres
	}: { slotIndex: number; accounts: LedgerAccount[]; costCentres: CostCentre[] } = $props();
</script>

<div class="grid gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
	<AccountSelect name={`accountId${slotIndex}`} {accounts} isRequired={false} placeholder="Account" />
	<CostCentreSelect name={`costCentreId${slotIndex}`} {costCentres} />
	<input name={`debit${slotIndex}`} type="number" step="0.01" min="0" placeholder="Debit" value="0" class={inputClasses} />
	<input name={`credit${slotIndex}`} type="number" step="0.01" min="0" placeholder="Credit" value="0" class={inputClasses} />
</div>
