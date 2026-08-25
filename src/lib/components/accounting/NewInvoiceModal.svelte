<script lang="ts">
	import FormField from './FormField.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { addDays, toIsoDate } from '$lib/data/accounting/accountingPeriods';
	import type { Client } from '$lib/server/accounting/getClients';
	import { inputClasses, selectClasses } from './accountingFormStyles';

	let {
		isOpen = $bindable(),
		clients,
		paymentTermsDays,
		preselectedClientId
	}: {
		isOpen: boolean;
		clients: Client[];
		paymentTermsDays: number;
		preselectedClientId: string;
	} = $props();

	const tracker = new FormTracker();
	const today = toIsoDate(new Date());
	let issueDate = $state(today);
	const dueDate = $derived(addDays(issueDate, paymentTermsDays));
</script>

<Modal title="New invoice" bind:isOpen>
	{#if clients.length === 0}
		<p class="text-chalk/70">
			Add a client first — <a href="/accounting/clients" class="text-signal">open clients</a>.
		</p>
	{:else}
		<form method="POST" action="?/createInvoice" use:enhance={tracker.submit()} class="flex flex-col gap-4">
			<FormField label="Client">
				<select name="clientId" required value={preselectedClientId} class={selectClasses}>
					<option value="">Choose a client</option>
					{#each clients as client (client.id)}
						<option value={client.id}>{client.name}</option>
					{/each}
				</select>
			</FormField>
			<div class="grid gap-4 sm:grid-cols-2">
				<FormField label="Issue date">
					<input name="issueDate" type="date" required bind:value={issueDate} class={inputClasses} />
				</FormField>
				<FormField label="Due date">
					<input name="dueDate" type="date" required value={dueDate} class={inputClasses} />
				</FormField>
			</div>
			<FormField label="Your reference (optional)">
				<input name="reference" class={inputClasses} />
			</FormField>
			<FormErrorNote message={tracker.errorMessage} />
			<div class="flex justify-end">
				<SubmitButton isSaving={tracker.isSaving}>Create draft</SubmitButton>
			</div>
		</form>
	{/if}
</Modal>
