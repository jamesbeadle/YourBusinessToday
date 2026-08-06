<script lang="ts">
	import AgentTypingIndicator from '../chat/AgentTypingIndicator.svelte';
	import ChatComposer from '../chat/ChatComposer.svelte';
	import ConversationTurnRow from './ConversationTurnRow.svelte';
	import { creditsPerBrainQuestion } from '$lib/data/creditPricing';
	import { invalidateAll } from '$app/navigation';
	import type { BrainConversationMessage, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		conversationId,
		messages,
		pageIndex,
		onOutOfCredits
	}: {
		conversationId: string | null;
		messages: BrainConversationMessage[];
		pageIndex: BrainPageSummary[];
		onOutOfCredits: () => void;
	} = $props();

	let isThinking = $state(false);
	let hasFailed = $state(false);
	let pendingQuestion = $state<string | null>(null);

	async function sendQuestion(question: string) {
		isThinking = true;
		hasFailed = false;
		pendingQuestion = question;
		const response = await fetch('/api/brain/ask', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ question, conversationId })
		});
		if (response.ok) await invalidateAll();
		isThinking = false;
		pendingQuestion = null;
		if (response.status === 402) return onOutOfCredits();
		if (!response.ok) hasFailed = true;
	}

	async function startFreshConversation() {
		const response = await fetch('/api/brain/conversations', { method: 'POST' });
		if (response.ok) await invalidateAll();
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h2 class="font-display text-xl font-medium">Talk to your brain</h2>
			<p class="text-sm text-chalk/60">
				A conversation grounded only in your own model — {creditsPerBrainQuestion} credits a turn.
			</p>
		</div>
		{#if messages.length > 0}
			<button
				onclick={startFreshConversation}
				class="shrink-0 rounded-full border border-hairline px-4 py-1.5 font-display text-xs
					text-chalk/70 transition hover:border-chalk/40 hover:text-chalk"
			>
				New conversation
			</button>
		{/if}
	</div>
	{#if messages.length > 0 || pendingQuestion !== null}
		<div class="flex max-h-[28rem] flex-col gap-3 overflow-y-auto pr-1">
			{#each messages as message (message.id)}
				<ConversationTurnRow {message} {pageIndex} />
			{/each}
			{#if pendingQuestion !== null}
				<div class="flex justify-end">
					<p class="max-w-prose rounded-2xl rounded-tr-sm bg-signal px-4 py-3 font-medium text-night">
						{pendingQuestion}
					</p>
				</div>
			{/if}
			{#if isThinking}
				<AgentTypingIndicator />
			{/if}
		</div>
	{/if}
	{#if hasFailed}
		<p class="text-sm text-caution">That turn went wrong — please try again.</p>
	{/if}
	<ChatComposer
		onSend={sendQuestion}
		isDisabled={isThinking}
		placeholder="Ask about a client, a supplier, a project…"
	/>
</section>
