<script lang="ts">
	import CommandBox from './CommandBox.svelte';
	import TerminalFeed from './TerminalFeed.svelte';
	import { createTerminalAsk } from './terminalAsk';
	import { createTerminalIngest } from './terminalIngest';
	import { fileDropZone } from './fileDropZone';
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
	let activeTransferName = $state<string | null>(null);
	let isDropTarget = $state(false);
	let scrollElement = $state<HTMLDivElement>();

	$effect(() => {
		void (messages.length + transferLines.length + Number(isThinking));
		void activeTransferName;
		const element = scrollElement;
		if (element !== undefined) element.scrollTo({ top: element.scrollHeight });
	});

	const linkPattern = /https?:\/\/[^\s]+/gi;

	async function sendCommand() {
		const question = commandText.trim();
		if (question === '' || isThinking) return;
		commandText = '';
		const links = question.match(linkPattern);
		if (links !== null) return ingestEveryLink(links);
		isThinking = true;
		await ask(question, conversationId);
		isThinking = false;
	}

	async function ingestEveryLink(links: string[]) {
		for (const link of links) {
			await ingest.ingestLinkedPage(link.replace(/[.,;)\]]+$/, ''));
		}
	}

	async function ingestEveryFile(files: File[]) {
		for (const file of files) await ingest.ingestDroppedFile(file);
	}

	const appendLine = (line: string) => (transferLines = [...transferLines, line]);

	const ingest = $derived(
		createTerminalIngest({
			brainId,
			appendLine,
			setActiveTransfer: (transferName) => (activeTransferName = transferName),
			onOutOfCredits
		})
	);

	const ask = $derived(
		createTerminalAsk({
			brainId,
			appendLine,
			onOutOfCredits,
			setPendingQuestion: (question) => (pendingQuestion = question)
		})
	);
</script>

<div
	role="log"
	class="relative flex h-full flex-col bg-night font-mono text-[13px] leading-relaxed"
	use:fileDropZone={{ onHover: (isHovering) => (isDropTarget = isHovering), onDrop: ingestEveryFile }}
>
	<div bind:this={scrollElement} class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
		<TerminalFeed
			{messages}
			{pageIndex}
			{pageBasePath}
			{pendingQuestion}
			{isThinking}
			{transferLines}
			{activeTransferName}
		/>
	</div>
	<CommandBox bind:text={commandText} onSend={sendCommand} />
	{#if isDropTarget}
		<div
			class="pointer-events-none absolute inset-2 flex items-center justify-center rounded-xl
				border-2 border-dashed border-signal/60 bg-night/80 text-signal"
		>
			drop to ingest
		</div>
	{/if}
</div>
