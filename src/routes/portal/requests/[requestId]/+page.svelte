<script lang="ts">
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import RequestStatusPill from '$lib/components/requests/RequestStatusPill.svelte';
	import RequestThread from '$lib/components/requests/RequestThread.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';

	let { data, form } = $props();

	const featureRequest = $derived(data.featureRequest);
</script>

<svelte:head>
	<title>{featureRequest.reference} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a href="/portal" class="font-display text-sm text-chalk/50 hover:text-chalk">← Your projects</a>
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="font-display text-3xl font-medium">{featureRequest.title}</h1>
			<RequestStatusPill status={featureRequest.status} isDelivered={featureRequest.isDelivered} />
		</div>
		<p class="text-chalk/70">
			{featureRequest.reference} · {featureRequest.projectName} ·
			{formatBritishDate(featureRequest.createdAt)}
		</p>
	</div>
	<FormErrorNote message={form?.message ?? null} />

	<section class="flex flex-col gap-3 rounded-2xl border border-hairline p-6">
		<p class="whitespace-pre-wrap text-chalk/80">{featureRequest.body}</p>
		{#if featureRequest.benefit !== ''}
			<p class="text-sm text-chalk/60">So that {featureRequest.benefit}</p>
		{/if}
	</section>

	{#if featureRequest.isDelivered && featureRequest.environmentUrl !== ''}
		<p class="text-sm text-chalk/70">
			Live at
			<a href={featureRequest.environmentUrl} target="_blank" rel="noreferrer" class="text-go hover:brightness-110">
				{featureRequest.environmentUrl}
			</a>
		</p>
	{/if}

	{#if featureRequest.decisionNote !== ''}
		<section class="rounded-2xl border border-hairline p-6">
			<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Our answer</h2>
			<p class="mt-2 text-chalk/80">{featureRequest.decisionNote}</p>
		</section>
	{/if}

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Thread</h2>
		<RequestThread comments={data.comments} />
	</section>
</div>
