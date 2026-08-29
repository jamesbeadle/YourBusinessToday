<script lang="ts">
	import { findKnowledgeKind } from '$lib/data/knowledge/knowledgeKinds';
	import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

	let { processMap }: { processMap: ProcessMapSummary } = $props();

	const accent = findKnowledgeKind('process').accent;
</script>

<li>
	<a
		href={`/workspace/${processMap.entityId}/workflows/${processMap.id}`}
		class="flex gap-4 rounded-2xl border border-hairline bg-carriage p-4 transition
			hover:border-signal/60"
	>
		<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" class="shrink-0">
			<polyline
				points="6,16 32,16 44,30"
				fill="none"
				stroke={accent}
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<polyline
				points="8,44 24,44 38,28 52,28"
				fill="none"
				stroke="var(--color-go)"
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="32" cy="16" r="3.5" fill="var(--color-night)" stroke="var(--color-chalk)" stroke-width="2" />
			<circle cx="38" cy="28" r="3.5" fill="var(--color-night)" stroke="var(--color-chalk)" stroke-width="2" />
			<circle cx="24" cy="44" r="3.5" fill="var(--color-night)" stroke="var(--color-chalk)" stroke-width="2" />
		</svg>
		<div class="flex min-w-0 flex-col gap-1">
			<p class="truncate font-display text-base font-medium">{processMap.name}</p>
			<p class="flex flex-wrap items-center gap-2 text-xs text-chalk/50">
				<span
					class="rounded-full border px-2 py-0.5"
					style={`border-color: ${accent}66; color: ${accent}`}
				>
					Process
				</span>
				<span>Process map</span>
			</p>
		</div>
	</a>
</li>
