<script lang="ts">
	let {
		shouldIncludeDone,
		viewedUserId
	}: { shouldIncludeDone: boolean; viewedUserId: string | null } = $props();

	function filterHref(shouldShowAll: boolean): string {
		const parameters = new URLSearchParams();
		if (shouldShowAll) parameters.set('status', 'all');
		if (viewedUserId !== null) parameters.set('user', viewedUserId);
		const query = parameters.toString();
		if (query === '') return '/tasks';
		return `/tasks?${query}`;
	}

	const filterOptions = $derived([
		{ label: 'Open', href: filterHref(false), isActive: !shouldIncludeDone },
		{ label: 'All', href: filterHref(true), isActive: shouldIncludeDone }
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
