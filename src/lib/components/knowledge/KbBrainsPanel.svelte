<script lang="ts">
	import { kindForCategory, findKnowledgeKind } from '$lib/data/knowledge/knowledgeKinds';
	import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

	let {
		knowledgeBaseId,
		brains,
		processMaps
	}: {
		knowledgeBaseId: string;
		brains: KbBrainSummary[];
		processMaps: ProcessMapSummary[];
	} = $props();

	type PanelRow = { id: string; name: string; href: string };

	const groups = $derived([
		{
			kind: findKnowledgeKind('expertise'),
			rows: rowsFor('domain'),
			addHref: `/knowledge-base/${knowledgeBaseId}/brains/new?kind=expertise`
		},
		{
			kind: findKnowledgeKind('experience'),
			rows: rowsFor('instance'),
			addHref: `/knowledge-base/${knowledgeBaseId}/brains/new?kind=experience`
		},
		{
			kind: findKnowledgeKind('process'),
			rows: processMaps.map((processMap) => ({
				id: processMap.id,
				name: processMap.name,
				href: `/workspace/${processMap.entityId}/workflows/${processMap.id}`
			})),
			addHref: `/knowledge-base/${knowledgeBaseId}/brains/new?kind=process`
		}
	]);

	function rowsFor(category: 'domain' | 'instance'): PanelRow[] {
		return brains
			.filter((brain) => brain.category === category)
			.map((brain) => ({
				id: brain.id,
				name: brain.name,
				href: `/knowledge-base/${knowledgeBaseId}/brains/${brain.id}`
			}));
	}
</script>

<div class="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
	{#each groups as group (group.kind.kind)}
		<section class="flex flex-col gap-1.5">
			<div class="flex items-center justify-between gap-2">
				<h3 class="font-display text-sm" style={`color: ${group.kind.accent}`}>
					{group.kind.label}
				</h3>
				<a
					href={group.addHref}
					class="font-display text-xs text-chalk/50 transition hover:text-chalk"
				>
					+ add
				</a>
			</div>
			<p class="text-xs text-chalk/40">{group.kind.question}</p>
			{#if group.rows.length === 0}
				<p class="rounded-xl border border-dashed border-hairline px-3 py-2 text-xs text-chalk/40">
					Nothing here yet.
				</p>
			{:else}
				<ul class="flex flex-col divide-y divide-hairline rounded-xl border border-hairline">
					{#each group.rows as row (row.id)}
						<li>
							<a
								href={row.href}
								class="block truncate px-3 py-2 text-sm text-chalk/80 transition
									hover:bg-carriage hover:text-chalk"
							>
								{row.name}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/each}
</div>
