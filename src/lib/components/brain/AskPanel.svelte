<script lang="ts">
	import AnswerCard from './AnswerCard.svelte';
	import ChatComposer from '../chat/ChatComposer.svelte';
	import { creditsPerBrainQuestion } from '$lib/data/creditPricing';
	import { invalidateAll } from '$app/navigation';
	import type { BrainAnswer, BrainEvent, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		events,
		pageIndex,
		onOutOfCredits
	}: {
		events: BrainEvent[];
		pageIndex: BrainPageSummary[];
		onOutOfCredits: () => void;
	} = $props();

	type AskedQuestion = { question: string; answer: BrainAnswer };

	let isThinking = $state(false);
	let hasFailed = $state(false);

	const askedQuestions = $derived(
		events.filter((event) => event.kind === 'question_answered').map(asAskedQuestion)
	);

	function asAskedQuestion(event: BrainEvent): AskedQuestion {
		return {
			question: String(event.detail.question ?? ''),
			answer: {
				answerMarkdown: String(event.detail.answerMarkdown ?? ''),
				citedSlugs: Array.isArray(event.detail.citedSlugs)
					? event.detail.citedSlugs.map(String)
					: []
			}
		};
	}

	async function askQuestion(question: string) {
		isThinking = true;
		hasFailed = false;
		const response = await fetch('/api/brain/ask', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ question })
		});
		isThinking = false;
		if (response.status === 402) return onOutOfCredits();
		if (!response.ok) return void (hasFailed = true);
		await invalidateAll();
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div>
		<h2 class="font-display text-xl font-medium">Ask your brain</h2>
		<p class="text-sm text-chalk/60">
			Answers come only from your own records — {creditsPerBrainQuestion} credits a question.
		</p>
	</div>
	<ChatComposer
		onSend={askQuestion}
		isDisabled={isThinking}
		placeholder="Ask about a client, a supplier, a project…"
	/>
	{#if isThinking}
		<p class="text-sm text-chalk/50">Reading the wiki…</p>
	{/if}
	{#if hasFailed}
		<p class="text-sm text-caution">That question went wrong — please try again.</p>
	{/if}
	{#each askedQuestions as askedQuestion, questionIndex (questionIndex)}
		<AnswerCard
			question={askedQuestion.question}
			answer={askedQuestion.answer}
			{pageIndex}
		/>
	{/each}
</section>
