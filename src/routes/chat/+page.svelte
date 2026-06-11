<script lang="ts">
	import AgentTypingIndicator from '$lib/components/chat/AgentTypingIndicator.svelte';
	import ChatComposer from '$lib/components/chat/ChatComposer.svelte';
	import ChatMessageBubble from '$lib/components/chat/ChatMessageBubble.svelte';
	import type { ChatMessage } from '$lib/data/chatTypes';
	import {
		agentReplyDelayMilliseconds,
		agentReplyForTurn,
		openingQuestion
	} from '$lib/data/scriptedAgent';

	let messages = $state<ChatMessage[]>([{ id: 0, author: 'agent', text: openingQuestion }]);
	let isAgentTyping = $state(false);
	let userTurnCount = $state(0);
	let threadElement = $state<HTMLElement | null>(null);

	function sendUserMessage(text: string) {
		userTurnCount += 1;
		messages.push({ id: messages.length, author: 'user', text });
		queueAgentReply(userTurnCount);
	}

	function queueAgentReply(turn: number) {
		isAgentTyping = true;
		setTimeout(() => {
			messages.push({ id: messages.length, author: 'agent', text: agentReplyForTurn(turn) });
			isAgentTyping = false;
		}, agentReplyDelayMilliseconds);
	}

	$effect(() => {
		void messages.length;
		void isAgentTyping;
		threadElement?.scrollTo({ top: threadElement.scrollHeight, behavior: 'smooth' });
	});
</script>

<svelte:head>
	<title>The Agent — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
	<header class="flex flex-col gap-2">
		<p class="font-display text-sm tracking-widest text-tfl-red uppercase">Demo — replies are scripted</p>
		<h1 class="font-display text-3xl">The Agent</h1>
		<p class="max-w-prose text-map-ink/80">
			This is the conversation that builds your Workflow Map. Answer in your own words — the agent
			keeps digging until your whole business is on the map.
		</p>
	</header>
	<div
		bind:this={threadElement}
		class="flex h-[26rem] flex-col gap-4 overflow-y-auto rounded-2xl border border-map-grid
			bg-map-grid/20 p-5"
	>
		{#each messages as message (message.id)}
			<ChatMessageBubble {message} />
		{/each}
		{#if isAgentTyping}
			<AgentTypingIndicator />
		{/if}
	</div>
	<ChatComposer onSend={sendUserMessage} isDisabled={isAgentTyping} />
</div>
