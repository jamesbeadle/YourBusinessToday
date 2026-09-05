<script lang="ts">
	import { dashboardMotion } from './dashboardMotion';
	import { prefersReducedMotion } from '../../brain/constellation/orbitRig';
	import { knowledgeBaseHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import { fade } from 'svelte/transition';
	import type { OpenBrain } from '$lib/data/knowledge/findOpenBrain';

	let { knowledgeBaseId, brain }: { knowledgeBaseId: string; brain: OpenBrain } = $props();

	const cut = { duration: 0 };

	function fadeInAfterFlight() {
		if (prefersReducedMotion()) return cut;
		return {
			delay: dashboardMotion.flightMilliseconds,
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
	class="absolute inset-0 z-20 flex flex-col justify-between p-4 pt-16 lg:pt-4"
	in:fade={fadeInAfterFlight()}
	out:fade={fadeOut()}
>
	<div class="flex flex-col gap-0.5">
		<h1 class="font-display text-lg font-medium text-chalk">{brain.name}</h1>
		<p
			class="font-display text-[10px] tracking-widest uppercase"
			style={`color: ${brain.kind.accent}`}
		>
			{brain.kind.label} brain
		</p>
	</div>
	<a
		href={knowledgeBaseHref(knowledgeBaseId)}
		class="self-start pb-12 font-display text-xs text-chalk/50 transition hover:text-chalk lg:pb-0"
	>
		← Knowledge base
	</a>
</section>
