<script lang="ts">
	import { dashboardMotion } from './dashboardMotion';
	import { useBrainFlight } from './brainFlight.svelte';
	import { prefersReducedMotion } from '../../brain/constellation/orbitRig';
	import { knowledgeBaseHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import type { OpenBrain } from '$lib/data/knowledge/findOpenBrain';

	let {
		knowledgeBaseId,
		brain,
		children
	}: { knowledgeBaseId: string; brain: OpenBrain; children: Snippet } = $props();

	const flight = useBrainFlight();
	const cut = { duration: 0 };

	function fadeInOnceLanded() {
		if (prefersReducedMotion()) return cut;
		return {
			delay: flight.viewFadeDelayMilliseconds,
			duration: dashboardMotion.viewFadeMilliseconds
		};
	}

	function fadeOut() {
		if (prefersReducedMotion()) return cut;
		return { duration: dashboardMotion.viewFadeMilliseconds };
	}
</script>

<section
	aria-label={brain.name}
	class="absolute inset-0 z-20 bg-night"
	in:fade={fadeInOnceLanded()}
	out:fade={fadeOut()}
>
	<header class="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-14 items-center px-4">
		<div class="flex min-w-0 flex-col gap-0.5 pr-48 lg:pr-72">
			<h1 class="truncate font-display text-lg font-medium text-chalk">{brain.name}</h1>
			<p
				class="font-display text-[10px] tracking-widest uppercase"
				style={`color: ${brain.kind.accent}`}
			>
				{brain.kind.label} brain
			</p>
		</div>
	</header>
	<div class="absolute inset-x-0 top-14 bottom-0">
		{@render children()}
	</div>
	<a
		href={knowledgeBaseHref(knowledgeBaseId)}
		class="absolute bottom-16 left-4 z-10 font-display text-xs text-chalk/50 transition
			hover:text-chalk lg:bottom-4"
	>
		← Knowledge base
	</a>
</section>
