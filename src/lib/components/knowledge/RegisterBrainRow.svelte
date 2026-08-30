<script lang="ts">
	import BrainGlyph from './BrainGlyph.svelte';
	import { findKnowledgeKind } from '$lib/data/knowledge/knowledgeKinds';
	import type { RegisterBrain } from '$lib/server/knowledge/getSecondBrainRegister';

	let { brain }: { brain: RegisterBrain } = $props();

	const kind = $derived(findKnowledgeKind(brain.kind));
	const updatedOn = $derived(new Date(brain.updatedAt).toLocaleDateString());
</script>

<li>
	<a
		href={brain.href}
		class="flex items-center gap-4 px-4 py-3 transition hover:bg-carriage sm:px-5"
	>
		{#if brain.kind === 'process'}
			<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" class="shrink-0">
				<polyline
					points="4,12 22,12 32,22"
					fill="none"
					stroke={kind.accent}
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<polyline
					points="6,32 17,32 27,20 37,20"
					fill="none"
					stroke="var(--color-go)"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<circle cx="22" cy="12" r="2.5" fill="var(--color-night)" stroke="var(--color-chalk)" stroke-width="1.5" />
				<circle cx="27" cy="20" r="2.5" fill="var(--color-night)" stroke="var(--color-chalk)" stroke-width="1.5" />
			</svg>
		{:else}
			<BrainGlyph seed={brain.id} category={brain.kind === 'expertise' ? 'domain' : 'instance'} size={40} />
		{/if}
		<div class="flex min-w-0 flex-1 flex-col gap-0.5">
			<span class="truncate font-display text-base font-medium">{brain.name}</span>
			{#if brain.entityName !== ''}
				<span class="truncate text-xs text-chalk/50">{brain.entityName}</span>
			{/if}
		</div>
		<span
			class="shrink-0 rounded-full border px-2.5 py-0.5 text-xs"
			style={`border-color: ${kind.accent}66; color: ${kind.accent}`}
		>
			{kind.label}
		</span>
		<span class="hidden shrink-0 text-xs text-chalk/40 sm:block">updated {updatedOn}</span>
	</a>
</li>
