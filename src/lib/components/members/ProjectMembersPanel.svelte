<script lang="ts">
	import AddMemberForm from './AddMemberForm.svelte';
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import type { Account } from '$lib/server/accounts/accountRecord';

	let { members }: { members: Account[] } = $props();

	let isAddMemberModalOpen = $state(false);
	let isRemoveModalOpen = $state(false);
	let memberAwaitingRemoval = $state<Account | null>(null);

	function openRemoveModal(member: Account) {
		memberAwaitingRemoval = member;
		isRemoveModalOpen = true;
	}
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex items-center justify-between">
		<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Members</h2>
		<button
			type="button"
			onclick={() => (isAddMemberModalOpen = true)}
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Add member
		</button>
	</div>
	{#if members.length === 0}
		<p class="text-sm text-chalk/60">
			Nobody outside staff can reach this project yet. Members work on it with you through Claude.
		</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each members as member (member.id)}
				<li class="flex items-center gap-4">
					<span class="min-w-0 flex-1 truncate font-display text-sm">{member.name}</span>
					<span class="truncate text-xs text-chalk/50">{member.email}</span>
					<button
						type="button"
						onclick={() => openRemoveModal(member)}
						aria-label={`Remove ${member.name}`}
						class="px-1 text-chalk/40 transition hover:text-signal"
					>
						✕
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<Modal title="Add member" bind:isOpen={isAddMemberModalOpen}>
	<AddMemberForm onAdded={() => (isAddMemberModalOpen = false)} />
</Modal>

{#if memberAwaitingRemoval !== null}
	<DangerConfirmModal
		title="Remove member"
		description={`Remove ${memberAwaitingRemoval.name} from this project? They lose access straight away; nothing they said is deleted.`}
		action="?/removeMember"
		fields={{ accountId: memberAwaitingRemoval.id }}
		submitLabel="Remove"
		bind:isOpen={isRemoveModalOpen}
	/>
{/if}
