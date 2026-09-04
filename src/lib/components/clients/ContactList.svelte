<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { quietButtonClasses } from '$lib/components/site/formStyles';
	import type { ClientContact } from '$lib/server/clients/clientContactRecord';

	let { contacts }: { contacts: ClientContact[] } = $props();
</script>

<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
	{#each contacts as contact (contact.id)}
		<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
			<div class="min-w-0">
				<p class="font-display">
					{contact.name}
					{#if contact.isPrimary}
						<span class="ml-2 rounded-full bg-chalk/10 px-2 py-0.5 text-xs text-chalk/60">primary</span>
					{/if}
				</p>
				<p class="text-xs text-chalk/50">
					{[contact.email, contact.role].filter(Boolean).join(' · ')}
				</p>
			</div>
			{#if contact.invitedAt === null}
				<form method="POST" action="?/inviteContact">
					<input type="hidden" name="contactId" value={contact.id} />
					<SubmitButton class={quietButtonClasses} savingLabel="Inviting…">Invite</SubmitButton>
				</form>
			{:else}
				<p class="text-xs text-chalk/40">Invited {formatBritishDate(contact.invitedAt)}</p>
			{/if}
		</li>
	{/each}
</ul>
