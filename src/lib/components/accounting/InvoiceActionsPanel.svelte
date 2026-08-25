<script lang="ts">
	import RecordPaymentModal from './RecordPaymentModal.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { formatMoney } from '$lib/data/accounting/money';
	import {
		dangerButtonClasses,
		panelClasses,
		primaryButtonClasses,
		quietButtonClasses
	} from './accountingFormStyles';
	import type { InvoiceDetail } from '$lib/server/accounting/getInvoice';

	let { invoice }: { invoice: InvoiceDetail } = $props();

	const tracker = new FormTracker();
	let isPaymentModalOpen = $state(false);
	const outstanding = $derived(invoice.total - invoice.amountPaid);
	const canVoid = $derived(invoice.status !== 'void' && invoice.payments.length === 0);
</script>

<section class={panelClasses}>
	<div class="flex items-baseline justify-between">
		<h2 class="font-display text-lg font-medium">Outstanding</h2>
		<span class="font-display text-xl tabular-nums">{formatMoney(outstanding)}</span>
	</div>
	<div class="flex flex-wrap gap-3">
		{#if invoice.status === 'draft'}
			<form method="POST" action="?/issue" use:enhance={tracker.submit()}>
				<SubmitButton isSaving={tracker.isSaving} savingLabel="Issuing…" class={primaryButtonClasses}>
					Issue invoice
				</SubmitButton>
			</form>
		{/if}
		{#if invoice.status === 'issued'}
			<button type="button" onclick={() => (isPaymentModalOpen = true)} class={primaryButtonClasses}>
				Record payment
			</button>
		{/if}
		<a href={`/accounting/invoices/${invoice.id}/print`} class={quietButtonClasses}>Print / PDF</a>
		{#if canVoid}
			<form method="POST" action="?/void" use:enhance={tracker.submit()}>
				<button type="submit" class={dangerButtonClasses}>Void</button>
			</form>
		{/if}
	</div>
	<FormErrorNote message={tracker.errorMessage} />
</section>

<RecordPaymentModal bind:isOpen={isPaymentModalOpen} {outstanding} />
