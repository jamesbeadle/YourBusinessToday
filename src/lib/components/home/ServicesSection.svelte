<script lang="ts">
	import ServiceCard from './ServiceCard.svelte';
	import { knowledgeServices } from '$lib/data/knowledgeServices';
</script>

<section class="border-y border-hairline bg-carriage/60">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<div class="flex flex-col gap-2">
			<h2 class="font-display text-3xl font-medium">Services powered by your knowledge</h2>
			<p class="max-w-prose text-chalk/70">
				The brain is the engine, not the product. These services draw on it — sharing what you
				know, running how you work, finding who you serve next — and each gets sharper as your
				knowledge grows.
			</p>
		</div>
		<div class="mt-10 grid gap-6 md:grid-cols-3">
			{#each knowledgeServices as service (service.id)}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>
