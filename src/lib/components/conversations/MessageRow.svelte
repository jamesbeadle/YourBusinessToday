<script lang="ts">
	import { formatBritishDateTime } from '$lib/data/britishDate';
	import type { NamedMessage } from '$lib/server/conversations/withAuthorNames';

	let { message }: { message: NamedMessage } = $props();

	const internalClasses = 'bg-carriage/40';
</script>

<li class={`flex flex-col gap-1 px-5 py-4 ${message.isInternal ? internalClasses : ''}`}>
	<p class="text-xs text-chalk/50">
		<span class="font-display text-chalk/80">{message.authorName}</span>
		· {formatBritishDateTime(message.createdAt)}
		{#if message.isInternal}
			· <span class="text-caution">internal</span>
		{/if}
	</p>
	<p class="whitespace-pre-wrap text-chalk/90">{message.body}</p>
</li>
