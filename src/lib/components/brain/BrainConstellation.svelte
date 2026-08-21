<script lang="ts">
	import ConstellationHud from './ConstellationHud.svelte';
	import NeuronDetailPanel from './NeuronDetailPanel.svelte';
	import NeuronTooltip from './NeuronTooltip.svelte';
	import { buildConstellationModel } from './constellation/buildConstellationModel';
	import { createConstellationExploration } from './constellation/constellationExploration.svelte';
	import { untrack } from 'svelte';
	import {
		createConstellationExperience,
		type ConstellationExperience
	} from './constellation/createConstellationExperience';
	import type { BrainPagePayload } from './constellation/fetchBrainPage';
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
	let hasWatchedEmptyBrain = false;

	const exploration = createConstellationExploration({
		pageIndex: () => pageIndex,
		experience: () => experience
	});

	$effect(() => {
		if (canvasElement === undefined || containerElement === undefined) return;
		const mounted = createConstellationExperience(
			canvasElement,
			containerElement,
			untrack(() => model),
			exploration.callbacks,
			{ shouldCascadeInitialModel: hasWatchedEmptyBrain }
		);
		experience = mounted;
		return () => mounted.destroy();
	});

	$effect(() => {
		if (!hasNeurons) hasWatchedEmptyBrain = true;
		experience?.updateModel(model);
	});

	export function drillToNeuron(slug: string): void {
		exploration.rememberSelection(slug);
		experience?.focusNeuron(slug);
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
			focusedContextSlug={exploration.focusedContextSlug}
			selectedSlug={exploration.selectedSlug}
			onReturnToModel={exploration.returnToModel}
			onReturnToContext={exploration.returnToContext}
		/>
		{#if exploration.hover !== null && exploration.selectedSlug === null}
			<NeuronTooltip hover={exploration.hover} {contexts} {pageIndex} />
		{/if}
		{#if exploration.selectedSlug !== null}
			<NeuronDetailPanel
				{loadPage}
				{pageBasePath}
				slug={exploration.selectedSlug}
				onClose={exploration.returnToContext}
			/>
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
