<script lang="ts">
	import { dashboardMotion } from './dashboardMotion';
	import { topRowHeightPixels } from './dashboardLayout';
	import { useBrainFlight } from './brainFlight.svelte';
	import { prefersReducedMotion } from '../../brain/constellation/orbitRig';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import type { OpenBrain } from '$lib/data/knowledge/findOpenBrain';

	let { brain, children }: { brain: OpenBrain; children: Snippet } = $props();

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
	<div class="absolute inset-x-0 bottom-0" style:top={`${topRowHeightPixels}px`}>
		{@render children()}
	</div>
</section>
