<script lang="ts">
	import { creditsPerHiveMindQuestion } from '$lib/data/creditPricing';

	let { memberCount }: { memberCount: number } = $props();
</script>

<section class="mx-auto flex max-w-6xl flex-col gap-6 px-6 pt-20 pb-10">
	<p class="font-display text-sm tracking-widest text-signal uppercase">The Hive Mind</p>
	<h1 class="max-w-3xl font-display text-4xl leading-tight font-medium md:text-5xl">
		Every specialist. One answer.
	</h1>
	<p class="max-w-prose text-lg text-chalk/70">
		Expertise brains that pass review join the hive as specialists — snapshots of what real
		businesses actually know. Ask one question and the hive consults every specialty that can
		help, tells you whose expertise is speaking, and pays those specialists for it.
	</p>
	<p class="font-display text-sm text-chalk/60">
		{creditsPerHiveMindQuestion} credits a question ·
		{memberCount === 1 ? '1 specialist' : `${memberCount} specialists`} in the hive
	</p>
</section>
