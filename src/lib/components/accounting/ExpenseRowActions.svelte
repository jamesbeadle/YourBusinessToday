<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import { enhance } from '$app/forms';
	import { toIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { confirmButtonClasses, dangerButtonClasses, inputClasses } from './accountingFormStyles';
	import type { ExpenseSummary } from '$lib/server/accounting/getExpenses';

	let { expense }: { expense: ExpenseSummary } = $props();

	let isDeleteOpen = $state(false);
</script>

<div class="flex items-center gap-2">
	{#if expense.paidOn === null}
		<form method="POST" action="?/payExpense" use:enhance class="flex items-center gap-2">
			<input type="hidden" name="expenseId" value={expense.id} />
			<input
				name="paidOn"
				type="date"
				value={toIsoDate(new Date())}
				aria-label="Paid on"
				class={`${inputClasses} py-1 text-sm`}
			/>
			<button type="submit" class={confirmButtonClasses}>Mark paid</button>
		</form>
	{/if}
	<button type="button" onclick={() => (isDeleteOpen = true)} class={dangerButtonClasses}>Delete</button>
</div>

<DangerConfirmModal
	title="Delete this expense?"
	description={`${expense.supplier} will be removed along with the ledger entries it posted.`}
	action="?/deleteExpense"
	fields={{ expenseId: expense.id }}
	submitLabel="Delete expense"
	bind:isOpen={isDeleteOpen}
/>
