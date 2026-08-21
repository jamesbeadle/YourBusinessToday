<script lang="ts">
	import TerminalTurn from './TerminalTurn.svelte';
	import { creditsPerBrainIngest, creditsPerBrainQuestion } from '$lib/data/creditPricing';
	import type { BrainConversationMessage, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		messages,
		pageIndex,
		pageBasePath,
		pendingQuestion,
		isThinking,
		transferLines
	}: {
		messages: BrainConversationMessage[];
		pageIndex: BrainPageSummary[];
		pageBasePath: string;
		pendingQuestion: string | null;
		isThinking: boolean;
		transferLines: string[];
	} = $props();
</script>

<p class="mb-3 text-xs text-chalk/35">
	domain brain · {creditsPerBrainQuestion} credits a question · drop a file or paste a link to
	ingest ({creditsPerBrainIngest} credits)
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
