<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';
	import ArchiveToggleRow from '$lib/components/accounting/ArchiveToggleRow.svelte';
	import NewLedgerAccountForm from '$lib/components/accounting/NewLedgerAccountForm.svelte';
	import { ledgerAccountTypeLabels, ledgerAccountTypeOrder } from '$lib/data/accounting/ledgerAccountTypes';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Chart of accounts — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Chart of accounts"
		description="Every ledger account a journal can touch. System accounts (bank, debtors, creditors, accruals, prepayments) are fixed; add income and expense accounts as your business needs them."
	/>
	<ActionMessage message={form?.message} />
	<NewLedgerAccountForm />
	{#each ledgerAccountTypeOrder as accountType (accountType)}
		{@const accountsOfType = data.accounts.filter((account) => account.accountType === accountType)}
		<section class="flex flex-col gap-3">
			<h2 class="font-display text-lg font-medium">{ledgerAccountTypeLabels[accountType]}</h2>
			<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
				{#each accountsOfType as account (account.id)}
					<ArchiveToggleRow
						idFieldName="accountId"
						itemId={account.id}
						label={`${account.code} · ${account.name}`}
						detail={account.isSystem ? 'System account' : ''}
						isArchived={account.isArchived}
						canArchive={!account.isSystem}
					/>
				{/each}
			</ul>
		</section>
	{/each}
</div>
