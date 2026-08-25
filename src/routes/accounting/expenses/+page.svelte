<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import ExpenseRow from '$lib/components/accounting/ExpenseRow.svelte';
	import NewExpenseModal from '$lib/components/accounting/NewExpenseModal.svelte';
	import { primaryButtonClasses } from '$lib/components/accounting/accountingFormStyles';

	let { data, form } = $props();

	let isNewExpenseOpen = $state(false);
</script>

<svelte:head>
	<title>Expenses — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Expenses"
		description="Costs and bills, each tagged to an account and optionally a cost centre. Post a bill unpaid to hold it in trade creditors until you settle it."
	>
		{#snippet actions()}
			<button type="button" onclick={() => (isNewExpenseOpen = true)} class={primaryButtonClasses}>
				Record expense
			</button>
		{/snippet}
	</AccountingPageHeader>
	<ActionMessage message={form?.message} />
	{#if data.expenses.length === 0}
		<EmptyState message="No expenses recorded yet." />
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.expenses as expense (expense.id)}
				<ExpenseRow {expense} />
			{/each}
		</ul>
	{/if}
</div>

<NewExpenseModal
	bind:isOpen={isNewExpenseOpen}
	expenseAccounts={data.expenseAccounts}
	costCentres={data.costCentres}
/>
