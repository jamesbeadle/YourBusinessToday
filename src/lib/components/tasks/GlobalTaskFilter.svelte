<script lang="ts">
	let { shouldIncludeDone }: { shouldIncludeDone: boolean } = $props();

	const filterOptions = $derived([
		{ label: 'Open', href: '/tasks', isActive: !shouldIncludeDone },
		{ label: 'All', href: '/tasks?status=all', isActive: shouldIncludeDone }
	]);
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each filterOptions as filterOption (filterOption.label)}
		<a
			href={filterOption.href}
			class={`rounded-full border px-4 py-1.5 font-display text-sm transition ${
				filterOption.isActive
					? 'border-go bg-go/10 text-go'
					: 'border-hairline text-chalk/60 hover:border-chalk/40 hover:text-chalk'
			}`}
		>
			{filterOption.label}
		</a>
	{/each}
</div>
