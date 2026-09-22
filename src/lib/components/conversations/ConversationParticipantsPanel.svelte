<script lang="ts">
	import { enhance } from '$app/forms';
	import ParticipantChip from './ParticipantChip.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { ProjectPerson } from '$lib/server/members/projectPersonRecord';

	let {
		people,
		participantIds
	}: { people: ProjectPerson[]; participantIds: string[] } = $props();

	const tracker = new FormTracker();

	const participants = $derived(people.filter((person) => participantIds.includes(person.id)));
	const outsiders = $derived(people.filter((person) => !participantIds.includes(person.id)));
</script>

<section class="flex flex-col gap-3">
	<h2 class="font-display text-xl font-medium">In this conversation</h2>
	<p class="text-sm text-chalk/60">
		Everyone here is told of each message. Posting, being assigned or raising it joins you.
	</p>
	{#if participants.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			Nobody yet — add someone on the project and they will be told what is said here.
		</p>
	{:else}
		<ul class="flex flex-wrap gap-2">
			{#each participants as person (person.id)}
				<ParticipantChip {person} />
			{/each}
		</ul>
	{/if}
	{#if outsiders.length > 0}
		<form
			method="POST"
			action="?/addParticipant"
			use:enhance={tracker.submit()}
			class="flex flex-wrap items-center gap-3"
		>
			<select
				name="accountId"
				required
				class="rounded-full border border-hairline bg-transparent px-4 py-1.5 font-display text-sm
					text-chalk/80"
			>
				<option value="" disabled selected>Add someone…</option>
				{#each outsiders as person (person.id)}
					<option value={person.id}>{person.name}</option>
				{/each}
			</select>
			<SubmitButton
				isSaving={tracker.isSaving}
				savingLabel="Adding…"
				class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
					transition hover:border-go hover:text-go"
			>
				Add
			</SubmitButton>
		</form>
	{/if}
</section>
