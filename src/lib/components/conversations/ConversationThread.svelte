<script lang="ts">
	import ConversationComposer from './ConversationComposer.svelte';
	import MessageRow from './MessageRow.svelte';
	import type { NamedMessage } from '$lib/server/conversations/withAuthorNames';

	let {
		messages,
		canMarkInternal = false
	}: { messages: NamedMessage[]; canMarkInternal?: boolean } = $props();
</script>

<section class="flex flex-col gap-3">
	<h2 class="font-display text-xl font-medium">Conversation</h2>
	{#if messages.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			Nothing said yet. Whatever is posted here is read by everyone on the project — and by their
			Claude.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each messages as message (message.id)}
				<MessageRow {message} />
			{/each}
		</ul>
	{/if}
	<ConversationComposer {canMarkInternal} />
</section>
