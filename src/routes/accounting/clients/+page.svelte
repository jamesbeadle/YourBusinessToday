<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import ClientFormFields from '$lib/components/accounting/ClientFormFields.svelte';
	import ClientRow from '$lib/components/accounting/ClientRow.svelte';
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { primaryButtonClasses } from '$lib/components/accounting/accountingFormStyles';

	let { data } = $props();

	let isCreateModalOpen = $state(false);
	const tracker = new FormTracker();
</script>

<svelte:head>
	<title>Clients — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader title="Clients" description="The businesses you invoice.">
		{#snippet actions()}
			<button type="button" onclick={() => (isCreateModalOpen = true)} class={primaryButtonClasses}>
				New client
			</button>
		{/snippet}
	</AccountingPageHeader>
	{#if data.clients.length === 0}
		<EmptyState message="Add your first client and you can raise them an invoice straight away." />
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.clients as client (client.id)}
				<ClientRow {client} />
			{/each}
		</ul>
	{/if}
</div>

<Modal title="New client" bind:isOpen={isCreateModalOpen}>
	<form method="POST" action="?/createClient" use:enhance={tracker.submit()} class="flex flex-col gap-4">
		<ClientFormFields />
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex justify-end">
			<SubmitButton isSaving={tracker.isSaving}>Create client</SubmitButton>
		</div>
	</form>
</Modal>
