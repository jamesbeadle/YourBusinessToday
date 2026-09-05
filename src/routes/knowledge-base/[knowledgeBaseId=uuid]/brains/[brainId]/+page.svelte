<script lang="ts">
	import BrainViewFrame from '$lib/components/knowledge/dashboard/BrainViewFrame.svelte';
	import ExperienceBrainView from '$lib/components/knowledge/brainViews/ExperienceBrainView.svelte';
	import ExpertiseBrainView from '$lib/components/knowledge/brainViews/ExpertiseBrainView.svelte';
	import ProcessBrainView from '$lib/components/knowledge/brainViews/ProcessBrainView.svelte';

	let { data } = $props();

	const knowledgeBaseId = $derived(data.knowledgeBase.id);
	const brainId = $derived(data.openBrain.id);
</script>

<svelte:head>
	<title>{data.openBrain.name} — {data.knowledgeBase.name}</title>
</svelte:head>

<BrainViewFrame brain={data.openBrain}>
	{#if data.view.kind === 'expertise'}
		<ExpertiseBrainView {knowledgeBaseId} {brainId} view={data.view} />
	{:else if data.view.kind === 'experience'}
		<ExperienceBrainView {knowledgeBaseId} isOwner={data.isOwner} view={data.view} />
	{:else}
		<ProcessBrainView
			{knowledgeBaseId}
			isOwner={data.isOwner}
			creditBalance={data.creditBalance}
			view={data.view}
		/>
	{/if}
</BrainViewFrame>
