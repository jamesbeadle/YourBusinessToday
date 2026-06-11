<script lang="ts">
	import { TubeLineColours } from '$lib/data/tubeLineColours';

	const steps = [
		{
			colour: TubeLineColours.central,
			title: 'Talk',
			copy: 'The agent opens with one question — “Tell us about your business today?” — then keeps asking until nothing is left unsaid.'
		},
		{
			colour: TubeLineColours.district,
			title: 'Map',
			copy: 'Every role becomes a line, every task a station, every handover an interchange. Your whole business on one page.'
		},
		{
			colour: TubeLineColours.piccadilly,
			title: 'Automate',
			copy: 'With inputs and outputs defined at every stop, you can see exactly which journeys are ready to run themselves.'
		}
	];
</script>

<section class="border-y border-map-grid bg-map-grid/30">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<h2 class="font-display text-3xl">How the journey works</h2>
		<div class="mt-10 grid gap-10 md:grid-cols-3">
			{#each steps as step, stepIndex}
				<article class="flex flex-col gap-4">
					<svg viewBox="0 0 240 40" aria-hidden="true" class="w-full">
						<line
							x1="10"
							y1="20"
							x2="230"
							y2="20"
							stroke={step.colour}
							stroke-width="10"
							stroke-linecap="round"
						/>
						<circle cx="120" cy="20" r="9" fill="white" stroke="var(--color-map-ink)" stroke-width="3.5" />
					</svg>
					<h3 class="font-display text-xl">
						{stepIndex + 1}. {step.title}
					</h3>
					<p class="text-map-ink/80">{step.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>
