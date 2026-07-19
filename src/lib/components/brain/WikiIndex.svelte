<script lang="ts">
	import type { BrainPageSummary } from '$lib/data/brainTypes';

	let { pageIndex }: { pageIndex: BrainPageSummary[] } = $props();

	const categories = $derived([...new Set(pageIndex.map((page) => page.category))]);

	function pagesIn(category: string): BrainPageSummary[] {
		return pageIndex.filter((page) => page.category === category);
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div>
		<h2 class="font-display text-xl font-medium">The wiki</h2>
		<p class="text-sm text-chalk/60">
			Everything the brain knows, one page per client, supplier, project, or topic.
		</p>
	</div>
	{#if pageIndex.length === 0}
		<p class="rounded-xl border-2 border-dashed border-hairline p-6 text-center text-sm text-chalk/50">
			No pages yet — add your first document and the librarian will start writing.
		</p>
	{:else}
		{#each categories as category (category)}
			<div class="flex flex-col gap-2">
				<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">{category}</h3>
				<ul class="flex flex-col gap-1.5">
					{#each pagesIn(category) as page (page.slug)}
						<li>
							<a href={`/brain/${page.slug}`} class="group flex flex-col">
								<span class="font-display text-sm text-chalk transition group-hover:text-signal">
									{page.title}
								</span>
								<span class="text-xs text-chalk/50">{page.summary}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	{/if}
</section>
