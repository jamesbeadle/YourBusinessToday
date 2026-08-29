<script lang="ts">
	import ImportBrainsPanel from '$lib/components/knowledge/ImportBrainsPanel.svelte';
	import KnowledgeBaseGrid from '$lib/components/knowledge/KnowledgeBaseGrid.svelte';
	import NewKnowledgeBaseForm from '$lib/components/knowledge/NewKnowledgeBaseForm.svelte';

	let { data } = $props();

	let isCreateFormOpen = $state(false);
</script>

<svelte:head>
	<title>Knowledge Base — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<header class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<p class="font-display text-sm tracking-widest text-signal uppercase">Knowledge Base</p>
			<h1 class="font-display text-3xl font-medium">Everything you know, in one place</h1>
			<p class="max-w-prose text-chalk/70">
				A knowledge base holds two kinds of brains. Expertise brains hold what you know — the
				rules, language, and models of your trade. Experience brains record what you’ve done —
				every job, event, and decision, in the terms your expertise defines.
			</p>
		</div>
		<button
			type="button"
			onclick={() => (isCreateFormOpen = !isCreateFormOpen)}
			class="rounded-full bg-signal px-6 py-3 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			{isCreateFormOpen ? 'Close' : 'New knowledge base'}
		</button>
	</header>
	{#if isCreateFormOpen}
		<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-5">
			<h2 class="font-display text-lg font-medium">New knowledge base</h2>
			<NewKnowledgeBaseForm />
		</section>
	{/if}
	{#if data.knowledgeBases.length === 0}
		<div
			class="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-hairline
				p-12 text-center"
		>
			<p class="max-w-prose text-chalk/60">
				Create your first knowledge base, then grow it with expertise brains for what you know
				and experience brains for what you’ve done.
			</p>
			<button
				type="button"
				onclick={() => (isCreateFormOpen = true)}
				class="rounded-full border border-signal px-6 py-2.5 font-display text-sm text-signal
					transition hover:bg-signal hover:text-night"
			>
				Create a knowledge base
			</button>
		</div>
	{:else}
		<KnowledgeBaseGrid knowledgeBases={data.knowledgeBases} />
	{/if}
	{#if data.unfiledBrains.length > 0 && data.knowledgeBases.length > 0}
		<ImportBrainsPanel unfiledBrains={data.unfiledBrains} knowledgeBases={data.knowledgeBases} />
	{/if}
</div>
