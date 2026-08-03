<script lang="ts">
	import ContextModelSection from './ContextModelSection.svelte';
	import type { BrainContext, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		contexts,
		pageIndex
	}: { contexts: BrainContext[]; pageIndex: BrainPageSummary[] } = $props();

	const contextMapPage = $derived(pageIndex.find((page) => page.kind === 'context_map'));

	const strayPages = $derived(pageIndex.filter(isOutsideEveryContext));

	function pagesIn(context: BrainContext): BrainPageSummary[] {
		return pageIndex.filter((page) => page.contextSlug === context.slug);
	}

	function isOutsideEveryContext(page: BrainPageSummary): boolean {
		if (page.kind === 'context_map') return false;
		if (page.contextSlug === null) return true;
		return !contexts.some((context) => context.slug === page.contextSlug);
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex items-baseline justify-between gap-3">
		<div>
			<h2 class="font-display text-xl font-medium">The model</h2>
			<p class="text-sm text-chalk/60">
				Your business as a domain model — one bounded context per area, one page per building
				block.
			</p>
		</div>
		{#if contextMapPage !== undefined}
			<a
				href={`/domain-brain/${contextMapPage.slug}`}
				class="shrink-0 font-display text-xs text-chalk/70 underline transition hover:text-chalk"
			>
				Context map
			</a>
		{/if}
	</div>
	{#if contexts.length === 0 && pageIndex.length === 0}
		<p class="rounded-xl border-2 border-dashed border-hairline p-6 text-center text-sm text-chalk/50">
			No model yet — add your first document and the modeller will start building.
		</p>
	{:else}
		{#each contexts as context (context.slug)}
			<ContextModelSection {context} pages={pagesIn(context)} />
		{/each}
		{#if strayPages.length > 0}
			<div class="flex flex-col gap-1.5">
				<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Unassigned</h3>
				<ul class="flex flex-col gap-1.5">
					{#each strayPages as page (page.slug)}
						<li>
							<a href={`/domain-brain/${page.slug}`} class="group flex flex-col">
								<span class="font-display text-sm text-chalk transition group-hover:text-signal">
									{page.title}
								</span>
								<span class="text-xs text-chalk/50">{page.summary}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</section>
