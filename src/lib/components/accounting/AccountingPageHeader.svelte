<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		actions
	}: { title: string; description: string; actions?: Snippet } = $props();
</script>

<header class="flex flex-wrap items-end justify-between gap-4 print:hidden">
	<div class="flex flex-col gap-2">
		<p class="font-display text-sm tracking-widest text-signal uppercase">Accounting</p>
		<h1 class="font-display text-3xl font-medium">{title}</h1>
		<p class="max-w-prose text-chalk/70">{description}</p>
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-3">
			{@render actions()}
		</div>
	{/if}
</header>
