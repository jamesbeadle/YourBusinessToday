<script lang="ts">
	import type { EcosystemTool } from '$lib/data/ecosystemTools';

	let { tool }: { tool: EcosystemTool } = $props();
</script>

<article
	class={`flex flex-col gap-3 rounded-2xl border bg-night p-6
		${tool.isLive ? 'border-go' : 'border-hairline'}`}
>
	<div class="flex items-center justify-between gap-3">
		<h3 class="font-display text-lg font-medium">{tool.name}</h3>
		{#if tool.isLive}
			<span
				class="shrink-0 rounded-full bg-go px-3 py-0.5 font-display text-xs font-medium
					whitespace-nowrap text-night"
			>
				Live now
			</span>
		{:else}
			<span
				class="shrink-0 rounded-full border border-hairline px-3 py-0.5 font-display text-xs
					whitespace-nowrap text-chalk/60"
			>
				Coming soon
			</span>
		{/if}
	</div>
	<p class="font-display text-sm text-signal">{tool.tagline}</p>
	<p class="text-sm text-chalk/70">{tool.description}</p>
	{#if tool.isLive && tool.href}
		<a
			href={tool.href}
			class="mt-auto self-start pt-2 font-display text-sm text-go underline underline-offset-4
				transition hover:brightness-110"
		>
			Try it now
		</a>
	{/if}
</article>
