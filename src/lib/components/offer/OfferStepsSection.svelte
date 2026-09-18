<script lang="ts">
	import OfferStepRow from './OfferStepRow.svelte';
	import { consultancyOfferSteps } from '$lib/data/consultancyOffer';
</script>

<section class="border-y border-hairline bg-carriage/60">
	<div class="mx-auto max-w-6xl px-6 py-20 md:py-24">
		<div class="border-t border-hairline">
			{#each consultancyOfferSteps as step, index (step.id)}
				<OfferStepRow {step} stepNumber={index + 1} />
			{/each}
		</div>
	</div>
</section>
