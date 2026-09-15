<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import InvitePersonForm from './InvitePersonForm.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import PersonRow from './PersonRow.svelte';
	import TransferOwnershipForm from './TransferOwnershipForm.svelte';
	import type { ProjectPerson } from '$lib/server/members/projectPersonRecord';

	let { people, isOwner }: { people: ProjectPerson[]; isOwner: boolean } = $props();

	let isInviteModalOpen = $state(false);
	let isTransferModalOpen = $state(false);
	let isRemoveModalOpen = $state(false);
	let personAwaitingRemoval = $state<ProjectPerson | null>(null);

	const members = $derived(people.filter((person) => !person.isOwner));

	function openRemoveModal(person: ProjectPerson) {
		personAwaitingRemoval = person;
		isRemoveModalOpen = true;
	}

	const peopleButtonClasses =
		'rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/70 transition hover:border-go hover:text-go';
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">People</h2>
		<div class="flex items-center gap-2">
			{#if isOwner && members.length > 0}
				<button type="button" onclick={() => (isTransferModalOpen = true)} class={peopleButtonClasses}>
					Transfer ownership
				</button>
			{/if}
			<button type="button" onclick={() => (isInviteModalOpen = true)} class={peopleButtonClasses}>
				Invite
			</button>
		</div>
	</div>
	<ul class="flex flex-col gap-2">
		{#each people as person (person.id)}
			<PersonRow {person} canRemove={!person.isOwner} onRemove={openRemoveModal} />
		{/each}
	</ul>
	{#if members.length === 0}
		<p class="text-sm text-chalk/60">
			It is just you so far. Invite someone and they can work this project with you.
		</p>
	{/if}
</section>

<Modal title="Invite someone" bind:isOpen={isInviteModalOpen}>
	<InvitePersonForm onInvited={() => (isInviteModalOpen = false)} />
</Modal>

<Modal title="Transfer ownership" bind:isOpen={isTransferModalOpen}>
	<TransferOwnershipForm {members} onTransferred={() => (isTransferModalOpen = false)} />
</Modal>

{#if personAwaitingRemoval !== null}
	<DangerConfirmModal
		title="Remove from project"
		description={`Remove ${personAwaitingRemoval.name} from this project? They lose access straight away; nothing they said or did is deleted.`}
		action="?/removeMember"
		fields={{ accountId: personAwaitingRemoval.id }}
		submitLabel="Remove"
		bind:isOpen={isRemoveModalOpen}
	/>
{/if}
