<script lang="ts">
	import TerminalTurn from './TerminalTurn.svelte';
	import { creditsPerBrainIngest, creditsPerBrainQuestion } from '$lib/data/creditPricing';
	import { invalidateAll } from '$app/navigation';
	import { createTerminalIngest } from './terminalIngest';
	import type { BrainConversationMessage, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		brainId,
		conversationId,
		messages,
		pageIndex,
		pageBasePath,
		onOutOfCredits
	}: {
		brainId: string;
		conversationId: string | null;
		messages: BrainConversationMessage[];
		pageIndex: BrainPageSummary[];
		pageBasePath: string;
		onOutOfCredits: () => void;
	} = $props();

	let commandText = $state('');
	let isThinking = $state(false);
	let pendingQuestion = $state<string | null>(null);
	let transferLines = $state<string[]>([]);
	let isDropTarget = $state(false);
	let scrollElement = $state<HTMLDivElement>();

	$effect(() => {
		void (messages.length + transferLines.length + Number(isThinking));
		const element = scrollElement;
		if (element !== undefined) element.scrollTo({ top: element.scrollHeight });
	});

	const loneLinkPattern = /^https?:\/\/\S+$/i;

	async function sendCommand(event: SubmitEvent) {
		event.preventDefault();
		const question = commandText.trim();
		if (question === '' || isThinking) return;
		commandText = '';
		if (loneLinkPattern.test(question)) return ingest.ingestLinkedPage(question);
		isThinking = true;
		pendingQuestion = question;
		const response = await fetch('/api/brain/ask', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ brainId, question, conversationId })
		});
		if (response.ok) await invalidateAll();
		isThinking = false;
		pendingQuestion = null;
		if (response.status === 402) return onOutOfCredits();
		if (!response.ok) transferLines = [...transferLines, '✗ that turn went wrong — try again'];
	}

	const ingest = $derived(
		createTerminalIngest({
			brainId,
			appendLine: (line) => (transferLines = [...transferLines, line]),
			onOutOfCredits
		})
	);

	async function acceptDrop(event: DragEvent) {
		event.preventDefault();
		isDropTarget = false;
		for (const file of event.dataTransfer?.files ?? []) await ingest.ingestDroppedFile(file);
	}
</script>

<div
	role="log"
	class="relative flex h-full flex-col bg-night font-mono text-[13px] leading-relaxed"
	ondragover={(event) => {
		event.preventDefault();
		isDropTarget = true;
	}}
	ondragleave={() => (isDropTarget = false)}
	ondrop={acceptDrop}
>
	<div bind:this={scrollElement} class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
		<p class="mb-3 text-xs text-chalk/35">
			domain brain · {creditsPerBrainQuestion} credits a question · drop a file or paste a link to ingest
			({creditsPerBrainIngest} credits)
		</p>
		<div class="flex flex-col gap-3">
			{#each messages as message (message.id)}
				<TerminalTurn {message} {pageIndex} {pageBasePath} />
			{/each}
			{#if pendingQuestion !== null}
				<p class="text-chalk"><span class="text-signal select-none">❯</span> {pendingQuestion}</p>
			{/if}
			{#if isThinking}
				<p class="animate-pulse pl-4 text-chalk/40">thinking…</p>
			{/if}
			{#each transferLines as line, index (index)}
				<p class="text-chalk/60">{line}</p>
			{/each}
		</div>
	</div>
	<form onsubmit={sendCommand} class="flex items-center gap-2 border-t border-hairline px-4 py-3">
		<span class="text-signal select-none">❯</span>
		<input
			bind:value={commandText}
			disabled={isThinking}
			placeholder="ask about a client, a supplier, a project…"
			class="w-full bg-transparent text-chalk placeholder-chalk/30 outline-none"
		/>
	</form>
	{#if isDropTarget}
		<div
			class="pointer-events-none absolute inset-2 flex items-center justify-center rounded-xl
				border-2 border-dashed border-signal/60 bg-night/80 text-signal"
		>
			drop to ingest — {creditsPerBrainIngest} credits
		</div>
	{/if}
</div>
