<script lang="ts">
	import ExpenseRowActions from './ExpenseRowActions.svelte';
	import { formatIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { formatMoney } from '$lib/data/accounting/money';
	import type { ExpenseSummary } from '$lib/server/accounting/getExpenses';

	let { expense }: { expense: ExpenseSummary } = $props();

	const detailLine = $derived(
		[expense.accountName, expense.costCentreName, expense.description].filter(Boolean).join(' · ')
	);
</script>

<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
	<div class="min-w-0">
		<p class="font-display">
			{expense.supplier}
			{#if expense.paidOn === null}
				<span class="ml-2 rounded-full bg-caution/15 px-2 py-0.5 text-xs text-caution">unpaid</span>
			{/if}
		</p>
		<p class="text-xs text-chalk/50">{formatIsoDate(expense.expenseDate)} · {detailLine}</p>
	</div>
	<div class="flex items-center gap-4">
		<span class="font-display tabular-nums">{formatMoney(expense.amount)}</span>
		<ExpenseRowActions {expense} />
	</div>
</li>
