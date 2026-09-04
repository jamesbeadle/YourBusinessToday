<script lang="ts">
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import RequestTable from '$lib/components/requests/RequestTable.svelte';
	import { featureRequestStatusLabels, featureRequestStatusOrder } from '$lib/data/featureRequests';

	let { data } = $props();

	const filterClasses = 'rounded-full border px-4 py-1.5 font-display text-sm transition';
	const chosenClasses = `${filterClasses} border-go/60 text-go`;
	const availableClasses = `${filterClasses} border-hairline text-chalk/60 hover:text-chalk`;
</script>

<svelte:head>
	<title>Requests — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Requests</h1>
		<p class="text-chalk/70">Everything clients have asked for, newest first.</p>
	</div>
	<nav class="flex flex-wrap gap-3">
		<a href="/requests" class={data.status === null ? chosenClasses : availableClasses}>All</a>
		{#each featureRequestStatusOrder as status (status)}
			<a
				href={`/requests?status=${status}`}
				class={data.status === status ? chosenClasses : availableClasses}
			>
				{featureRequestStatusLabels[status]}
			</a>
		{/each}
	</nav>
	{#if data.requests.length === 0}
		<EmptyState message="Nothing in the queue." />
	{:else}
		<RequestTable requests={data.requests} basePath="/requests" />
	{/if}
</div>
