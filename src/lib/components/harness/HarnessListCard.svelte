<script lang="ts">
	let { label, title, items }: { label: string; title: string; items: string[] } = $props();
</script>

<div class="flex flex-col gap-3 rounded-2xl border border-hairline bg-night p-5">
	<p class="font-display text-xs tracking-widest text-chalk/50 uppercase">{label}</p>
	<p class="font-display text-lg font-medium">{title}</p>
	<ul class="flex flex-col gap-1.5 text-sm text-chalk/70">
		{#each items as item (item)}
			<li class="flex gap-2">
				<span class="text-signal" aria-hidden="true">·</span>
				<span>{item}</span>
			</li>
		{/each}
	</ul>
</div>
