<script lang="ts">
	import EcosystemToolCard from './EcosystemToolCard.svelte';
	import { ecosystemTools } from '$lib/data/ecosystemTools';
</script>

<section class="border-y border-hairline bg-carriage/60">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<div class="flex flex-col gap-2">
			<h2 class="font-display text-3xl font-medium">The ecosystem</h2>
			<p class="max-w-prose text-chalk/70">
				Four products, one route: understand how your business runs, plan the handover to AI,
				watch it work — and keep new clients coming. The first is live today, and each gets
				sharper as your business profile grows.
			</p>
		</div>
		<div class="mt-10 grid gap-6 md:grid-cols-2">
			{#each ecosystemTools as tool (tool.id)}
				<EcosystemToolCard {tool} />
			{/each}
		</div>
	</div>
</section>
