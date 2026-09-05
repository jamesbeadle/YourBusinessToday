<script lang="ts">
	let {
		shouldIncludeDone,
		isWaitingOnMe,
		viewedUserId
	}: { shouldIncludeDone: boolean; isWaitingOnMe: boolean; viewedUserId: string | null } =
		$props();

	function filterHref(status: string | null): string {
		const parameters = new URLSearchParams();
		if (status !== null) parameters.set('status', status);
		if (viewedUserId !== null) parameters.set('user', viewedUserId);
		const query = parameters.toString();
		if (query === '') return '/tasks';
		return `/tasks?${query}`;
	}

	const isOpenList = $derived(!shouldIncludeDone && !isWaitingOnMe);
	const filterOptions = $derived([
		{ label: 'Open', href: filterHref(null), isActive: isOpenList },
		{ label: 'All', href: filterHref('all'), isActive: shouldIncludeDone },
		{ label: 'Waiting on me', href: filterHref('waiting'), isActive: isWaitingOnMe }
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
