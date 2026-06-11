<script lang="ts">
	import Roundel from '../site/Roundel.svelte';
	import type { ChatMessage } from '$lib/data/chatTypes';

	let { message }: { message: ChatMessage } = $props();

	const isFromAgent = $derived(message.author === 'agent');
</script>

{#if isFromAgent}
	<div class="flex items-start gap-3">
		<Roundel size={30} />
		<p
			class="max-w-prose rounded-2xl rounded-tl-sm border border-map-grid bg-map-paper px-4 py-3
				shadow-sm"
		>
			{message.text}
		</p>
	</div>
{:else}
	<div class="flex justify-end">
		<p class="max-w-prose rounded-2xl rounded-tr-sm bg-tfl-blue px-4 py-3 text-white">
			{message.text}
		</p>
	</div>
{/if}
