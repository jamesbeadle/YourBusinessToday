<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { TaskComment } from '$lib/server/projects/getTaskComments';

	let { comments }: { comments: (TaskComment & { authorName: string })[] } = $props();

	const tracker = new FormTracker();

	function formatCommentDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<section class="flex flex-col gap-3">
	<h2 class="font-display text-xl font-medium">Comments</h2>
	{#if comments.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			No comments yet.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each comments as comment (comment.id)}
				<li class="flex flex-col gap-1 px-5 py-4">
					<p class="text-xs text-chalk/50">
						<span class="font-display text-chalk/80">{comment.authorName}</span>
						· {formatCommentDate(comment.createdAt)}
					</p>
					<p class="whitespace-pre-wrap text-chalk/90">{comment.body}</p>
				</li>
			{/each}
		</ul>
	{/if}
	<FormErrorNote message={tracker.errorMessage} />
	<form method="POST" action="?/addComment" use:enhance={tracker.submit()} class="flex items-start gap-3">
		<textarea
			name="body"
			required
			rows="2"
			placeholder="Add a comment"
			class="flex-1 rounded-xl border border-hairline bg-carriage px-4 py-2.5 text-chalk
				outline-none focus:border-go"
		></textarea>
		<SubmitButton
			isSaving={tracker.isSaving}
			savingLabel="Posting…"
			class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Post
		</SubmitButton>
	</form>
</section>
