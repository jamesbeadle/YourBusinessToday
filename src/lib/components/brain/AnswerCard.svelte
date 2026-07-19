<script lang="ts">
	import MarkdownBody from './MarkdownBody.svelte';
	import type { BrainAnswer, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		question,
		answer,
		pageIndex
	}: { question: string; answer: BrainAnswer; pageIndex: BrainPageSummary[] } = $props();

	function titleFor(slug: string): string {
		return pageIndex.find((page) => page.slug === slug)?.title ?? slug;
	}
</script>

<article class="flex flex-col gap-3 rounded-xl border border-hairline bg-night/60 p-5">
	<p class="font-display text-sm text-chalk/60">{question}</p>
	<MarkdownBody markdown={answer.answerMarkdown} />
	{#if answer.citedSlugs.length > 0}
		<div class="flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
			<span class="font-display text-xs tracking-widest text-chalk/50 uppercase">Grounded in</span>
			{#each answer.citedSlugs as slug (slug)}
				<a
					href={`/brain/${slug}`}
					class="rounded-full border border-hairline px-3 py-1 font-display text-xs text-chalk/80
						transition hover:border-chalk/40 hover:text-chalk"
				>
					{titleFor(slug)}
				</a>
			{/each}
		</div>
	{/if}
</article>
