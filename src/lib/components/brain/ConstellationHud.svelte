<script lang="ts">
	import ConstellationLegend from './ConstellationLegend.svelte';
	import type { BrainContext, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		contexts,
		pageIndex,
		focusedContextSlug,
		selectedSlug,
		onReturnToModel,
		onReturnToContext
	}: {
		contexts: BrainContext[];
		pageIndex: BrainPageSummary[];
		focusedContextSlug: string | null;
		selectedSlug: string | null;
		onReturnToModel: () => void;
		onReturnToContext: () => void;
	} = $props();

	const focusedContextName = $derived(
		contexts.find((context) => context.slug === focusedContextSlug)?.name ?? null
	);
	const selectedTitle = $derived(
		pageIndex.find((page) => page.slug === selectedSlug)?.title ?? null
	);
</script>

<div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
	<nav class="pointer-events-auto flex flex-wrap items-center gap-2 font-display text-sm">
		<button
			type="button"
			onclick={onReturnToModel}
			class="rounded-full border border-hairline bg-night/70 px-3 py-1 text-chalk/80 backdrop-blur
				transition hover:border-chalk/40 hover:text-chalk"
		>
			Whole brain
		</button>
		{#if focusedContextName !== null}
			<span class="text-chalk/40">/</span>
			<button
				type="button"
				onclick={onReturnToContext}
				class="rounded-full border border-hairline bg-night/70 px-3 py-1 text-chalk/80 backdrop-blur
					transition hover:border-chalk/40 hover:text-chalk"
			>
				{focusedContextName}
			</button>
		{/if}
		{#if selectedTitle !== null}
			<span class="text-chalk/40">/</span>
			<span class="rounded-full border border-signal/50 bg-night/70 px-3 py-1 text-signal backdrop-blur">
				{selectedTitle}
			</span>
		{/if}
	</nav>
	<ConstellationLegend />
</div>
<p
	class="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 font-display text-xs sm:block
		tracking-wide text-chalk/40"
>
	Drag to orbit · scroll to zoom · click a neuron to drill in
</p>
