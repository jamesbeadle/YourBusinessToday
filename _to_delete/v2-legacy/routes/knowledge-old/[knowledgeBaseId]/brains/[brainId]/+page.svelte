<script lang="ts">
	import BindingsPanel from '$lib/components/knowledge/BindingsPanel.svelte';
	import BrainDetailHeader from '$lib/components/knowledge/BrainDetailHeader.svelte';
	import BrainEditor from '$lib/components/knowledge/BrainEditor.svelte';
	import RetrievalSettingsPanel from '$lib/components/knowledge/RetrievalSettingsPanel.svelte';
	import { findBrainType } from '$lib/data/knowledge/brainTypeCatalog';

	let { data } = $props();

	const definition = $derived(findBrainType(data.brain.brainType));
	const isInstanceBrain = $derived(data.brain.category === 'instance');
	const isDddModel = $derived(data.brain.brainType === 'ddd_model');
</script>

<svelte:head>
	<title>{data.brain.name} — {data.knowledgeBase.name}</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
	<nav class="text-sm text-chalk/50">
		<a href="/knowledge" class="transition hover:text-signal">Knowledge Base</a>
		<span class="mx-2">/</span>
		<a href={`/knowledge/${data.knowledgeBase.id}`} class="transition hover:text-signal">
			{data.knowledgeBase.name}
		</a>
		<span class="mx-2">/</span>
		<span class="text-chalk/80">{data.brain.name}</span>
	</nav>
	<BrainDetailHeader brain={data.brain} isOwner={data.isOwner} />
	<div class="grid gap-6 lg:grid-cols-[1fr_18rem]">
		<div class="rounded-2xl border border-hairline bg-carriage/50 p-5">
			<BrainEditor
				editor={definition?.editor ?? 'notes'}
				items={data.items}
				schemaTypes={data.schemaTypes}
				dddEditorHref={data.dddEditorHref}
			/>
		</div>
		<aside class="flex flex-col gap-5">
			{#if isInstanceBrain}
				<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage/50 p-4">
					<h2 class="font-display text-xs tracking-widest text-chalk/50 uppercase">
						Domain bindings
					</h2>
					<BindingsPanel
						domainBrains={data.domainBrains}
						boundDomainBrainIds={data.boundDomainBrainIds}
					/>
				</section>
			{/if}
			{#if !isDddModel}
				<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage/50 p-4">
					<h2 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Retrieval</h2>
					<RetrievalSettingsPanel
						retrievalConfig={data.brain.retrievalConfig}
						brainType={data.brain.brainType}
					/>
				</section>
			{/if}
		</aside>
	</div>
</div>
