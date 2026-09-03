<script lang="ts">
	import AgentTypingIndicator from '../chat/AgentTypingIndicator.svelte';
	import ChatComposer from '../chat/ChatComposer.svelte';
	import ChatbotAllowancePill from './ChatbotAllowancePill.svelte';
	import ChatbotMessageBubble from './ChatbotMessageBubble.svelte';
	import ChatbotQuietState from './ChatbotQuietState.svelte';
	import { askChatbotEndpoint } from './chatbotAsk';
	import { creditsPerChatbotQuestion } from '$lib/data/creditPricing';
	import type { ChatbotMembership, ChatbotSpeaker, ChatbotSummary } from '$lib/data/chatbotTypes';
	import type { ChatbotConversation } from '$lib/server/chatbots/getChatbotConversation';

	let {
		chatbot,
		membership,
		conversation
	}: {
		chatbot: ChatbotSummary;
		membership: ChatbotMembership;
		conversation: ChatbotConversation;
	} = $props();

	type Line = { id: string; speaker: ChatbotSpeaker; body: string };

	let lines = $state<Line[]>(
		conversation.messages.map((message) => ({
			id: message.id,
			speaker: message.speaker,
			body: message.body
		}))
	);
	let remaining = $state(membership.allowanceCredits - membership.spentCredits);
	let isThinking = $state(false);
	let quietMessage = $state<string | null>(initialQuietMessage());
	let threadElement = $state<HTMLElement | null>(null);

	function initialQuietMessage(): string | null {
		if (chatbot.isPaused) return 'This bot is paused.';
		if (chatbot.poolCredits < creditsPerChatbotQuestion) {
			return 'This bot is out of credits — its owner needs to top it up.';
		}
		if (membership.allowanceCredits - membership.spentCredits < creditsPerChatbotQuestion) {
			return 'Your allowance for this period is used up — ask the bot owner for more.';
		}
		return null;
	}

	function appendLine(speaker: ChatbotSpeaker, body: string) {
		lines.push({ id: `${Date.now()}-${lines.length}`, speaker, body });
	}

	async function sendQuestion(text: string) {
		appendLine('member', text);
		isThinking = true;
		const result = await askChatbotEndpoint(chatbot.id, text);
		isThinking = false;
		if (result.kind === 'answered') {
			remaining = result.allowanceRemaining;
			appendLine('bot', result.answer.answerMarkdown);
			if (remaining < creditsPerChatbotQuestion) {
				quietMessage = 'Your allowance for this period is used up — ask the bot owner for more.';
			}
			return;
		}
		if (result.kind === 'refused') {
			quietMessage = `${result.message}.`;
			return;
		}
		appendLine('bot', result.message);
	}

	$effect(() => {
		void lines.length;
		void isThinking;
		threadElement?.scrollTo({ top: threadElement.scrollHeight, behavior: 'smooth' });
	});
</script>

<div class="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-3xl flex-col">
	<header class="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
		<h1 class="truncate font-display text-lg font-medium">{chatbot.name}</h1>
		<ChatbotAllowancePill {remaining} allowance={membership.allowanceCredits} />
	</header>
	<div bind:this={threadElement} class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
		{#if lines.length === 0}
			<p class="text-sm text-chalk/40">
				Ask {chatbot.name} anything its knowledge base might know. Each question uses
				{creditsPerChatbotQuestion} credits of your allowance.
			</p>
		{/if}
		{#each lines as line (line.id)}
			<ChatbotMessageBubble speaker={line.speaker} body={line.body} />
		{/each}
		{#if isThinking}
			<AgentTypingIndicator />
		{/if}
	</div>
	{#if quietMessage !== null}
		<ChatbotQuietState message={quietMessage} />
	{:else}
		<div class="border-t border-hairline p-3">
			<ChatComposer onSend={sendQuestion} isDisabled={isThinking} placeholder={`Ask ${chatbot.name}…`} />
		</div>
	{/if}
</div>
