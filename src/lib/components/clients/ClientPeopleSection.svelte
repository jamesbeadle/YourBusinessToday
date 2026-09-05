<script lang="ts">
	import DraftApproachForm from './DraftApproachForm.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewContactForm from './NewContactForm.svelte';
	import PersonCard from './PersonCard.svelte';
	import PersonFieldsForm from './PersonFieldsForm.svelte';
	import { primaryButtonClasses } from '$lib/components/site/formStyles';
	import type { ApproachDraft } from '$lib/server/clients/draftApproach';
	import type { Person } from '$lib/server/clients/getPeopleForClient';

	let { people, approachDraft }: { people: Person[]; approachDraft: ApproachDraft | null } = $props();

	let isNewContactModalOpen = $state(false);
	let personBeingEdited = $state<Person | null>(null);
	let isEditModalOpen = $state(false);
	let isApproachModalOpen = $state(false);

	$effect(() => {
		isApproachModalOpen = approachDraft !== null;
	});

	function edit(person: Person) {
		personBeingEdited = person;
		isEditModalOpen = true;
	}
</script>

<section class="flex flex-col gap-4">
	<div class="flex items-center justify-between gap-4">
		<h2 class="font-display text-xl">People</h2>
		<button class={primaryButtonClasses} onclick={() => (isNewContactModalOpen = true)}>
			Add contact
		</button>
	</div>
	{#if people.length === 0}
		<p class="text-sm text-chalk/50">Nobody listed yet.</p>
	{/if}
	{#each people as person (person.id)}
		<PersonCard {person} onEdit={edit} />
	{/each}
</section>

<Modal title="New contact" bind:isOpen={isNewContactModalOpen}>
	<NewContactForm />
</Modal>

<Modal title="Edit person" bind:isOpen={isEditModalOpen} maxWidthClass="max-w-2xl">
	{#if personBeingEdited !== null}
		<PersonFieldsForm person={personBeingEdited} />
	{/if}
</Modal>

<Modal title="Draft approach" bind:isOpen={isApproachModalOpen} maxWidthClass="max-w-2xl">
	{#if approachDraft !== null}
		<DraftApproachForm draft={approachDraft} />
	{/if}
</Modal>
