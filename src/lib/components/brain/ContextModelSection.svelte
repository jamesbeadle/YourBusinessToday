<script lang="ts">
	import { domainBlockLabels, domainBlockOrder } from '$lib/data/domainBlocks';
	import type { BrainContext, BrainPageSummary, DomainBlockKind } from '$lib/data/brainTypes';

	let {
		context,
		pages,
		pageBasePath
	}: { context: BrainContext; pages: BrainPageSummary[]; pageBasePath: string } = $props();

	const populatedKinds = $derived(domainBlockOrder.filter((kind) => pagesOf(kind).length > 0));

	function pagesOf(kind: DomainBlockKind): BrainPageSummary[] {
		return pages.filter((page) => page.kind === kind);
	}
</script>

<div class="flex flex-col gap-3 rounded-xl border border-hairline bg-night/60 p-4">
	<div class="flex items-baseline gap-2">
		<h3 class="font-display text-base font-medium">{context.name}</h3>
		{#if context.isCoreDomain}
			<span class="rounded-full border border-signal/60 px-2 py-0.5 font-display text-xs text-signal">
				Core domain
			</span>
		{/if}
	</div>
	{#if context.summary !== ''}
		<p class="text-xs text-chalk/50">{context.summary}</p>
	{/if}
	{#each populatedKinds as kind (kind)}
		<div class="flex flex-col gap-1.5">
			<h4 class="font-display text-xs tracking-widest text-chalk/50 uppercase">
				{domainBlockLabels[kind].plural}
			</h4>
			<ul class="flex flex-col gap-1.5">
				{#each pagesOf(kind) as page (page.slug)}
					<li>
						<a href={`${pageBasePath}/${page.slug}`} class="group flex flex-col">
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
</div>
