<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { inputClasses } from '$lib/components/site/formStyles';
	import type { RequestComment } from '$lib/server/requests/getRequestComments';

	let { comments }: { comments: RequestComment[] } = $props();
</script>

<div class="flex flex-col gap-4">
	{#if comments.length === 0}
		<p class="text-sm text-chalk/50">Nothing said yet.</p>
	{/if}
	{#each comments as comment (comment.id)}
		<article class="rounded-2xl border border-hairline px-5 py-4">
			<p class="text-xs text-chalk/40">{formatBritishDate(comment.createdAt)}</p>
			<p class="mt-2 whitespace-pre-wrap text-sm text-chalk/80">{comment.body}</p>
		</article>
	{/each}
	<form method="POST" action="?/comment" class="flex flex-col gap-3">
		<FormField label="Reply">
			<textarea name="body" rows="3" required class={inputClasses}></textarea>
		</FormField>
		<SubmitButton>Post reply</SubmitButton>
	</form>
</div>
