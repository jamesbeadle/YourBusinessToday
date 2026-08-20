<script lang="ts">
	import ConstellationHud from './ConstellationHud.svelte';
	import NeuronDetailPanel from './NeuronDetailPanel.svelte';
	import NeuronTooltip from './NeuronTooltip.svelte';
	import { buildConstellationModel } from './constellation/buildConstellationModel';
	import type { BrainPagePayload } from './constellation/fetchBrainPage';
	import { ConstellationExperience } from './constellation/createConstellationExperience';
	import type { ConstellationHover } from './constellation/constellationTypes';
	import type { BrainContext, BrainPageLink, BrainPageSummary } from '$lib/data/brainTypes';

	let {
		loadPage,
		pageBasePath,
		contexts,
		pageIndex,
		pageLinks
	}: {
		loadPage: (slug: string) => Promise<BrainPagePayload>;
		pageBasePath: string | null;
		contexts: BrainContext[];
		pageIndex: BrainPageSummary[];
		pageLinks: BrainPageLink[];
	} = $props();

	const model = $derived(buildConstellationModel(contexts, pageIndex, pageLinks));
	const hasNeurons = $derived(model.neurons.length > 0 || model.nuclei.length > 0);

	let containerElement = $state<HTMLDivElement>();
	let canvasElement = $state<HTMLCanvasElement>();
	let experience = $state<ConstellationExperience>();
	let hover = $state<ConstellationHover | null>(null);
	let focusedContextSlug = $state<string | null>(null);
	let selectedSlug = $state<string | null>(null);

	$effect(() => {
		if (canvasElement === undefined || containerElement === undefined) return;
		const mounted = new ConstellationExperience(canvasElement, containerElement, model, {
			onHover: (candidate) => (hover = candidate),
			onSelectNeuron: rememberSelection,
			onFocusContext: (contextSlug) => (focusedContextSlug = contextSlug)
		});
		experience = mounted;
		return () => mounted.destroy();
	});

	function rememberSelection(slug: string): void {
		selectedSlug = slug;
		const page = pageIndex.find((candidate) => candidate.slug === slug);
		focusedContextSlug = page?.contextSlug ?? focusedContextSlug;
	}

	function returnToModel(): void {
		selectedSlug = null;
		focusedContextSlug = null;
		experience?.resetView();
	}

	function returnToContext(): void {
		selectedSlug = null;
		experience?.focusContext(focusedContextSlug);
	}
</script>

{#if hasNeurons}
	<div
		bind:this={containerElement}
		class="relative h-full min-h-80 overflow-hidden bg-night"
	>
		<canvas bind:this={canvasElement} class="h-full w-full"></canvas>
		<ConstellationHud
			{contexts}
			{pageIndex}
			{focusedContextSlug}
			{selectedSlug}
			onReturnToModel={returnToModel}
			onReturnToContext={returnToContext}
		/>
		{#if hover !== null && selectedSlug === null}
			<NeuronTooltip {hover} {contexts} {pageIndex} />
		{/if}
		{#if selectedSlug !== null}
			<NeuronDetailPanel {loadPage} {pageBasePath} slug={selectedSlug} onClose={returnToContext} />
		{/if}
	</div>
{:else}
	<div
		class="flex h-full min-h-80 items-center justify-center
			text-sm text-chalk/50"
	>
		No neurons yet — add your first document and watch the constellation grow.
	</div>
{/if}
