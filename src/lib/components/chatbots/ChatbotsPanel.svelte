<script lang="ts">
	import ChatbotCard from './ChatbotCard.svelte';
	import NewChatbotForm from './NewChatbotForm.svelte';
	import type { ChatbotSummary } from '$lib/data/chatbotTypes';

	let { chatbots }: { chatbots: ChatbotSummary[] } = $props();
</script>

<div class="flex flex-col gap-4">
	<p class="text-sm text-chalk/60">
		A chatbot lets people ask this knowledge base without opening it. You fund it from your
		credits and decide how much each member may spend.
	</p>
	<NewChatbotForm />
	{#if chatbots.length === 0}
		<p class="text-xs text-chalk/40">No chatbots yet — name one above to get started.</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each chatbots as chatbot (chatbot.id)}
				<li><ChatbotCard {chatbot} /></li>
			{/each}
		</ul>
	{/if}
</div>
