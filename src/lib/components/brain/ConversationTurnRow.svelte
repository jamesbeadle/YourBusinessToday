<script lang="ts">
	import BrandMark from '../site/BrandMark.svelte';
	import MarkdownBody from './MarkdownBody.svelte';
	import type { BrainConversationMessage, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		message,
		pageIndex
	}: { message: BrainConversationMessage; pageIndex: BrainPageSummary[] } = $props();

	function titleFor(slug: string): string {
		return pageIndex.find((page) => page.slug === slug)?.title ?? slug;
	}
</script>

{#if message.speaker === 'user'}
	<div class="flex justify-end">
		<p class="max-w-prose rounded-2xl rounded-tr-sm bg-signal px-4 py-3 font-medium text-night">
			{message.body}
		</p>
	</div>
{:else}
	<div class="flex items-start gap-3">
		<BrandMark size={30} />
		<div
			class="flex max-w-prose flex-col gap-3 rounded-2xl rounded-tl-sm border border-hairline
				bg-night px-4 py-3"
		>
			<MarkdownBody markdown={message.body} />
			{#if message.citedSlugs.length > 0}
				<div class="flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
					<span class="font-display text-xs tracking-widest text-chalk/50 uppercase">
						Grounded in
					</span>
					{#each message.citedSlugs as slug (slug)}
						<a
							href={`/domain-brain/${slug}`}
							class="rounded-full border border-hairline px-3 py-1 font-display text-xs
								text-chalk/80 transition hover:border-chalk/40 hover:text-chalk"
						>
							{titleFor(slug)}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
