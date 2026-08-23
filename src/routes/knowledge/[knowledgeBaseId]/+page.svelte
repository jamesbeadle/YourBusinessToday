<script lang="ts">
	import { enhance } from '$app/forms';
	import BrainGlyph from '$lib/components/knowledge/BrainGlyph.svelte';
	import BrainSection from '$lib/components/knowledge/BrainSection.svelte';
	import KnowledgeBaseSharePanel from '$lib/components/knowledge/KnowledgeBaseSharePanel.svelte';
	import Modal from '$lib/components/site/Modal.svelte';

	let { data } = $props();

	let isShareModalOpen = $state(false);

	const domainBrains = $derived(data.brains.filter((brain) => brain.category === 'domain'));
	const instanceBrains = $derived(data.brains.filter((brain) => brain.category === 'instance'));
	const boundCounts = $derived(countBindings(data.bindings));

	function countBindings(bindings: { instanceBrainId: string }[]): Record<string, number> {
		const counts: Record<string, number> = {};
		for (const binding of bindings) {
			counts[binding.instanceBrainId] = (counts[binding.instanceBrainId] ?? 0) + 1;
		}
		return counts;
	}
</script>

<svelte:head>
	<title>{data.knowledgeBase.name} — Knowledge Base</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<nav class="text-sm text-chalk/50">
		<a href="/knowledge" class="transition hover:text-signal">Knowledge Base</a>
		<span class="mx-2">/</span>
		<span class="text-chalk/80">{data.knowledgeBase.name}</span>
	</nav>
	<header class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<BrainGlyph seed={data.knowledgeBase.id} category="domain" size={80} />
			<div class="flex flex-col gap-1">
				<h1 class="font-display text-3xl font-medium">{data.knowledgeBase.name}</h1>
				{#if data.knowledgeBase.description !== ''}
					<p class="max-w-prose text-chalk/70">{data.knowledgeBase.description}</p>
				{/if}
			</div>
		</div>
		{#if data.isOwner}
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => (isShareModalOpen = true)}
					class="rounded-full border border-hairline px-5 py-2 font-display text-sm
						text-chalk/80 transition hover:border-signal hover:text-signal"
				>
					Share
				</button>
				<form method="POST" action="?/setArchived" use:enhance>
					<input type="hidden" name="isArchived" value={String(!data.knowledgeBase.isArchived)} />
					<button
						type="submit"
						class="rounded-full border border-hairline px-5 py-2 font-display text-sm
							text-chalk/80 transition hover:border-signal hover:text-signal"
					>
						{data.knowledgeBase.isArchived ? 'Unarchive' : 'Archive'}
					</button>
				</form>
			</div>
		{/if}
	</header>
	<div class="grid gap-6 lg:grid-cols-2">
		<BrainSection
			knowledgeBaseId={data.knowledgeBase.id}
			category="domain"
			brains={domainBrains}
		/>
		<BrainSection
			knowledgeBaseId={data.knowledgeBase.id}
			category="instance"
			brains={instanceBrains}
			{boundCounts}
		/>
	</div>
</div>

<Modal title="Share this knowledge base" bind:isOpen={isShareModalOpen}>
	<KnowledgeBaseSharePanel shares={data.shares} />
</Modal>
