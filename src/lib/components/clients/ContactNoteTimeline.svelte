<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { inputClasses, quietButtonClasses } from '$lib/components/site/formStyles';
	import type { AuthoredNote } from '$lib/server/clients/getPeopleForClient';

	let { contactId, notes }: { contactId: string; notes: AuthoredNote[] } = $props();
</script>

<div class="flex flex-col gap-3">
	{#if notes.length === 0}
		<p class="text-xs text-chalk/40">Nothing noted yet.</p>
	{/if}
	{#each notes as note (note.id)}
		<article class="rounded-xl border border-hairline px-4 py-3">
			<p class="flex flex-wrap gap-x-2 text-xs text-chalk/40">
				<span>{formatBritishDate(note.createdAt)}</span>
				<span>{note.authorName}</span>
				{#if note.kind === 'approach'}
					<span class="text-go">Drafted approach</span>
				{/if}
			</p>
			<p class="mt-1 whitespace-pre-wrap text-sm text-chalk/80">{note.body}</p>
		</article>
	{/each}
	<form method="POST" action="?/addNote" class="flex flex-col gap-2">
		<input type="hidden" name="contactId" value={contactId} />
		<textarea
			name="body"
			rows="2"
			required
			placeholder="What did you learn?"
			aria-label="New note"
			class={`${inputClasses} text-sm`}
		></textarea>
		<div class="flex justify-end">
			<SubmitButton class={quietButtonClasses}>Add note</SubmitButton>
		</div>
	</form>
</div>
