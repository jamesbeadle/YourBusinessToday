<script lang="ts">
	import ClientProjectList from '$lib/components/clients/ClientProjectList.svelte';
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import RequestTable from '$lib/components/requests/RequestTable.svelte';
	import { primaryButtonClasses } from '$lib/components/site/formStyles';

	let { data } = $props();
</script>

<svelte:head>
	<title>Your projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-display text-3xl font-medium">Hello {data.contactName}</h1>
			<p class="text-chalk/70">What we run for {data.clientName}, and what you have asked for.</p>
		</div>
		<a href="/portal/requests/new" class={primaryButtonClasses}>Ask for something</a>
	</div>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Your projects</h2>
		{#if data.projects.length === 0}
			<EmptyState message="Nothing here yet — we will add your projects shortly." />
		{:else}
			<ClientProjectList projects={data.projects} />
		{/if}
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Your requests</h2>
		{#if data.requests.length === 0}
			<EmptyState message="You have not asked for anything yet." />
		{:else}
			<RequestTable requests={data.requests} basePath="/portal/requests" />
		{/if}
	</section>
</div>
