<script lang="ts">
	import ServiceCard from './ServiceCard.svelte';
	import { consultancyServices } from '$lib/data/consultancyServices';
</script>

<section class="border-y border-hairline bg-carriage/60">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<div class="flex flex-col gap-2">
			<p class="font-display text-sm tracking-widest text-signal uppercase">What we build</p>
			<h2 class="font-display text-3xl font-medium">Tools shaped like your business</h2>
			<p class="max-w-prose text-chalk/70">
				Nothing off the shelf, and nothing you have to adopt before it earns its place. Each
				piece is built for work you already do, and it goes live one piece at a time.
			</p>
		</div>
		<div class="mt-10 grid gap-6 md:grid-cols-2">
			{#each consultancyServices as service (service.id)}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>
