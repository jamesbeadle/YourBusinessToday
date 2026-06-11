<script lang="ts">
	import AgentTypingIndicator from './AgentTypingIndicator.svelte';
	import ChatComposer from './ChatComposer.svelte';
	import ChatMessageBubble from './ChatMessageBubble.svelte';
	import ChatPanelHeader from './ChatPanelHeader.svelte';
	import Roundel from '../site/Roundel.svelte';
	import type { StationSelection } from '../map/stationSelection';
	import type { ChatMessage } from '$lib/data/chatTypes';
	import { agentReplyDelayMilliseconds } from '$lib/data/scriptedAgent';
	import {
		projectAgentReply,
		projectSeedMessages,
		seedUserTurnCount
	} from '$lib/data/projectConversation';

	let { contextSelection }: { contextSelection: StationSelection | null } = $props();

	let isOpen = $state(false);
	let messages = $state<ChatMessage[]>([...projectSeedMessages]);
	let isAgentTyping = $state(false);
	let userTurnCount = $state(seedUserTurnCount);
	let threadElement = $state<HTMLElement | null>(null);

	function sendUserMessage(text: string) {
		userTurnCount += 1;
		messages.push({ id: messages.length, author: 'user', text });
		queueAgentReply(userTurnCount, contextSelection?.station.name ?? null);
	}

	function queueAgentReply(turn: number, stationName: string | null) {
		isAgentTyping = true;
		setTimeout(() => {
			messages.push({ id: messages.length, author: 'agent', text: projectAgentReply(turn, stationName) });
			isAgentTyping = false;
		}, agentReplyDelayMilliseconds);
	}

	$effect(() => {
		void messages.length;
		void isAgentTyping;
		threadElement?.scrollTo({ top: threadElement.scrollHeight, behavior: 'smooth' });
	});
</script>

{#if isOpen}
	<section
		class="fixed right-6 bottom-24 z-20 flex h-[30rem] w-[24rem] max-w-[calc(100vw-3rem)] flex-col
			overflow-hidden rounded-2xl border border-map-grid bg-map-paper shadow-2xl"
	>
		<ChatPanelHeader projectName="Jewel Bespoke Build" onClose={() => (isOpen = false)} />
		<div
			bind:this={threadElement}
			class="flex flex-1 flex-col gap-3 overflow-y-auto bg-map-grid/20 p-4 text-sm"
		>
			{#each messages as message (message.id)}
				<ChatMessageBubble {message} />
			{/each}
			{#if isAgentTyping}
				<AgentTypingIndicator />
			{/if}
		</div>
		{#if contextSelection}
			<p class="flex items-center gap-2 border-t border-map-grid px-4 py-2 text-xs text-map-ink/70">
				<span
					class="h-2 w-2 shrink-0 rounded-full"
					style={`background-color: ${contextSelection.line.colour}`}
				></span>
				Talking about {contextSelection.station.name} · {contextSelection.line.role}
			</p>
		{/if}
		<div class="border-t border-map-grid p-3">
			<ChatComposer onSend={sendUserMessage} isDisabled={isAgentTyping} />
		</div>
	</section>
{/if}

<button
	type="button"
	aria-label={isOpen ? 'Close the agent chat' : 'Open the agent chat'}
	class="fixed right-6 bottom-6 z-20 flex h-14 w-14 items-center justify-center rounded-full
		bg-tfl-blue shadow-lg transition hover:bg-tfl-red"
	onclick={() => (isOpen = !isOpen)}
>
	<Roundel size={30} />
</button>
