<script lang="ts">
	import ClientEventLedger from '$lib/components/clients/ClientEventLedger.svelte';
	import AssignProjectForm from '$lib/components/clients/AssignProjectForm.svelte';
	import ClientProjectList from '$lib/components/clients/ClientProjectList.svelte';
	import ContactList from '$lib/components/clients/ContactList.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewContactForm from '$lib/components/clients/NewContactForm.svelte';
	import RequestTable from '$lib/components/requests/RequestTable.svelte';
	import { clientStageLabels } from '$lib/data/clientLifecycle';
	import { primaryButtonClasses } from '$lib/components/site/formStyles';

	let { data, form } = $props();

	let isNewContactModalOpen = $state(false);
	let isAssignProjectModalOpen = $state(false);
</script>

<svelte:head>
	<title>{data.client.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a href="/clients" class="font-display text-sm text-chalk/50 hover:text-chalk">← Clients</a>
		<h1 class="font-display text-3xl font-medium">{data.client.name}</h1>
		<p class="text-chalk/70">
			{clientStageLabels[data.client.stage]}
			{#if data.client.website !== ''}
				· <a href={data.client.website} class="hover:text-signal">{data.client.website}</a>
			{/if}
		</p>
	</div>
	<FormErrorNote message={form?.message ?? null} />

	<section class="flex flex-col gap-4">
		<div class="flex items-center justify-between gap-4">
			<h2 class="font-display text-xl">People</h2>
			<button class={primaryButtonClasses} onclick={() => (isNewContactModalOpen = true)}>
				Add contact
			</button>
		</div>
		<ContactList contacts={data.contacts} />
	</section>

	<section class="flex flex-col gap-4">
		<div class="flex items-center justify-between gap-4">
			<h2 class="font-display text-xl">Projects</h2>
			<button class={primaryButtonClasses} onclick={() => (isAssignProjectModalOpen = true)}>
				Add project
			</button>
		</div>
		{#if data.projects.length === 0}
			<p class="text-sm text-chalk/50">
				No projects yet — set this client on a project from its own page.
			</p>
		{:else}
			<ClientProjectList projects={data.projects} />
		{/if}
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Requests</h2>
		{#if data.requests.length === 0}
			<p class="text-sm text-chalk/50">Nothing asked for yet.</p>
		{:else}
			<RequestTable requests={data.requests} basePath="/requests" />
		{/if}
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">History</h2>
		<ClientEventLedger events={data.events} />
	</section>
</div>

<Modal title="New contact" bind:isOpen={isNewContactModalOpen}>
	<NewContactForm />
</Modal>

<Modal title="Add project" bind:isOpen={isAssignProjectModalOpen}>
	<AssignProjectForm projects={data.unassignedProjects} />
</Modal>
