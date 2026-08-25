<script lang="ts">
	import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';
	import { selectClasses } from './accountingFormStyles';

	let {
		name,
		accounts,
		value = '',
		isRequired = true,
		placeholder = 'Choose an account'
	}: {
		name: string;
		accounts: LedgerAccount[];
		value?: string;
		isRequired?: boolean;
		placeholder?: string;
	} = $props();
</script>

<select {name} {value} required={isRequired} class={selectClasses}>
	<option value="">{placeholder}</option>
	{#each accounts as account (account.id)}
		<option value={account.id}>{account.code} · {account.name}</option>
	{/each}
</select>
