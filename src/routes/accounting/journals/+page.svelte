<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import AccrualModal from '$lib/components/accounting/AccrualModal.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import JournalRow from '$lib/components/accounting/JournalRow.svelte';
	import ManualJournalModal from '$lib/components/accounting/ManualJournalModal.svelte';
	import PrepaymentReleaseModal from '$lib/components/accounting/PrepaymentReleaseModal.svelte';
	import { primaryButtonClasses, quietButtonClasses } from '$lib/components/accounting/accountingFormStyles';

	let { data, form } = $props();

	let isManualOpen = $state(false);
	let isAccrualOpen = $state(false);
	let isPrepaymentOpen = $state(false);
</script>

<svelte:head>
	<title>Journals — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Journals"
		description="Every posting in the ledger, newest first. Invoices and expenses post their own; use these for month-end adjustments and anything else."
	>
		{#snippet actions()}
			<button type="button" onclick={() => (isAccrualOpen = true)} class={quietButtonClasses}>Accrual</button>
			<button type="button" onclick={() => (isPrepaymentOpen = true)} class={quietButtonClasses}>
				Release prepayment
			</button>
			<button type="button" onclick={() => (isManualOpen = true)} class={primaryButtonClasses}>
				Manual journal
			</button>
		{/snippet}
	</AccountingPageHeader>
	<ActionMessage message={form?.message} />
	{#if data.journals.length === 0}
		<EmptyState message="The ledger is empty. Issue an invoice or record an expense and its journal appears here." />
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.journals as journal (journal.id)}
				<JournalRow {journal} />
			{/each}
		</ul>
	{/if}
</div>

<ManualJournalModal bind:isOpen={isManualOpen} accounts={data.accounts} costCentres={data.costCentres} />
<AccrualModal bind:isOpen={isAccrualOpen} expenseAccounts={data.expenseAccounts} costCentres={data.costCentres} />
<PrepaymentReleaseModal
	bind:isOpen={isPrepaymentOpen}
	expenseAccounts={data.expenseAccounts}
	costCentres={data.costCentres}
/>
