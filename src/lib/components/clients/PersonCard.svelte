<script lang="ts">
	import ContactLinkList from './ContactLinkList.svelte';
	import ContactNoteTimeline from './ContactNoteTimeline.svelte';
	import PersonFacts from './PersonFacts.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { confirmButtonClasses, panelClasses, quietButtonClasses } from '$lib/components/site/formStyles';
	import type { Person } from '$lib/server/clients/getPeopleForClient';

	let { person, onEdit }: { person: Person; onEdit: (person: Person) => void } = $props();

	const contactLine = $derived([person.role, person.email, person.phone].filter(Boolean).join(' · '));
	const canInvite = $derived(person.email !== '' && person.invitedAt === null);
</script>

<article class={panelClasses}>
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="min-w-0">
			<p class="font-display">
				{person.name}
				{#if person.isPrimary}
					<span class="ml-2 rounded-full bg-chalk/10 px-2 py-0.5 text-xs text-chalk/60">primary</span>
				{/if}
			</p>
			<p class="text-xs text-chalk/50">{contactLine === '' ? 'No details yet' : contactLine}</p>
			{#if person.sourceUrl !== ''}
				<p class="text-xs text-chalk/40">
					Found on <a href={person.sourceUrl} class="hover:text-signal">{person.sourceUrl}</a>
				</p>
			{/if}
		</div>
		<div class="flex flex-wrap gap-2">
			<button type="button" class={quietButtonClasses} onclick={() => onEdit(person)}>Edit</button>
			<form method="POST" action="?/draftApproach">
				<input type="hidden" name="contactId" value={person.id} />
				<SubmitButton class={confirmButtonClasses} savingLabel="Drafting…">Draft approach</SubmitButton>
			</form>
			{#if canInvite}
				<form method="POST" action="?/inviteContact">
					<input type="hidden" name="contactId" value={person.id} />
					<SubmitButton class={quietButtonClasses} savingLabel="Inviting…">Invite</SubmitButton>
				</form>
			{/if}
			{#if person.invitedAt !== null}
				<p class="self-center text-xs text-chalk/40">Invited {formatBritishDate(person.invitedAt)}</p>
			{/if}
		</div>
	</div>
	<PersonFacts {person} />
	<ContactLinkList contactId={person.id} links={person.links} />
	<ContactNoteTimeline contactId={person.id} notes={person.notes} />
</article>
