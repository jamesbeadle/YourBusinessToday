<script lang="ts">
	import BrainGlyph from './BrainGlyph.svelte';
	import { findKnowledgeKind, kindForCategory } from '$lib/data/knowledge/knowledgeKinds';
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

	type ConstellationNode = {
		id: string;
		name: string;
		href: string;
		accent: string;
		kindLabel: string;
		category: 'domain' | 'instance' | null;
	};

	const nodes = $derived<ConstellationNode[]>([
		...brains.map((brain) => ({
			id: brain.id,
			name: brain.name,
			href: `/knowledge-base/${brain.knowledgeBaseId}/brains/${brain.id}`,
			accent: kindForCategory(brain.category).accent,
			kindLabel: kindForCategory(brain.category).label,
			category: brain.category
		})),
		...processMaps.map((processMap) => ({
			id: processMap.id,
			name: processMap.name,
			href: `/workspace/${processMap.entityId}/workflows/${processMap.id}`,
			accent: findKnowledgeKind('process').accent,
			kindLabel: 'Process',
			category: null
		}))
	]);

	const slotCount = $derived(nodes.length + 1);

	function slotPosition(slotIndex: number): { x: number; y: number } {
		const angle = -Math.PI / 2 + (2 * Math.PI * slotIndex) / slotCount;
		return { x: 50 + 36 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) };
	}
</script>

<div class="relative h-full w-full overflow-hidden">
	<svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
		{#each nodes as node, nodeIndex (node.kindLabel + node.id)}
			<line
				x1="50"
				y1="50"
				x2={slotPosition(nodeIndex).x}
				y2={slotPosition(nodeIndex).y}
				stroke={node.accent}
				stroke-width="0.15"
				opacity="0.5"
			/>
		{/each}
	</svg>
	<span
		class="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full
			bg-chalk shadow-[0_0_18px_4px_rgba(238,241,248,0.35)]"
		aria-hidden="true"
	></span>
	{#each nodes as node, nodeIndex (node.kindLabel + node.id)}
		<a
			href={node.href}
			class="group absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center
				gap-1.5 text-center"
			style={`left: ${slotPosition(nodeIndex).x}%; top: ${slotPosition(nodeIndex).y}%`}
		>
			<span
				class="rounded-full border-2 p-1 transition group-hover:scale-105"
				style={`border-color: ${node.accent}66; background-color: ${node.accent}11`}
			>
				{#if node.category === null}
					<svg viewBox="0 0 40 40" width="56" height="56" aria-hidden="true">
						<polyline
							points="6,14 22,14 32,24"
							fill="none"
							stroke={node.accent}
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<polyline
							points="8,30 18,30 26,20 34,20"
							fill="none"
							stroke="var(--color-go)"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<BrainGlyph seed={node.id} category={node.category} size={56} />
				{/if}
			</span>
			<span class="line-clamp-2 font-display text-xs text-chalk/80 transition group-hover:text-chalk">
				{node.name}
			</span>
			<span class="font-display text-[10px] tracking-wider uppercase" style={`color: ${node.accent}`}>
				{node.kindLabel}
			</span>
		</a>
	{/each}
	<a
		href={`/knowledge-base/${knowledgeBaseId}/brains/new`}
		class="group absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5
			text-center"
		style={`left: ${slotPosition(nodes.length).x}%; top: ${slotPosition(nodes.length).y}%`}
	>
		<span
			class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed
				border-hairline font-display text-2xl text-chalk/40 transition
				group-hover:border-signal/60 group-hover:text-signal"
		>
			+
		</span>
		<span class="font-display text-xs text-chalk/50 transition group-hover:text-chalk">
			Add a second brain
		</span>
	</a>
</div>
