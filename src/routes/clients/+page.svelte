<script lang="ts">
	import ClientTable from '$lib/components/clients/ClientTable.svelte';
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewClientForm from '$lib/components/clients/NewClientForm.svelte';
	import { primaryButtonClasses } from '$lib/components/site/formStyles';

	let { data, form } = $props();

	let isNewClientModalOpen = $state(false);
</script>

<svelte:head>
	<title>Clients — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-display text-3xl font-medium">Clients</h1>
			<p class="text-chalk/70">Everyone we work for, and everyone we hope to.</p>
		</div>
		<button class={primaryButtonClasses} onclick={() => (isNewClientModalOpen = true)}>
			New client
		</button>
	</div>
	<FormErrorNote message={form?.message ?? null} />
	{#if data.clients.length === 0}
		<EmptyState message="No clients yet. Add the first company you are talking to." />
	{:else}
		<ClientTable clients={data.clients} />
	{/if}
</div>

<Modal title="New client" bind:isOpen={isNewClientModalOpen}>
	<NewClientForm staffMembers={data.staffMembers} />
</Modal>
