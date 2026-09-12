<script lang="ts">
	import type { ConsultancyService } from '$lib/data/consultancyServices';

	let { service }: { service: ConsultancyService } = $props();
</script>

<article class="flex flex-col gap-3 rounded-2xl border border-hairline bg-night p-6">
	<h3 class="font-display text-lg font-medium">{service.name}</h3>
	<p class="font-display text-sm text-signal">{service.tagline}</p>
	<p class="text-sm text-chalk/70">{service.description}</p>
</article>
