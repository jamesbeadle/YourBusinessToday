<script lang="ts">
	import BrainViewFrame from '$lib/components/knowledge/dashboard/BrainViewFrame.svelte';
	import ExpertiseBrainView from '$lib/components/knowledge/brainViews/ExpertiseBrainView.svelte';

	let { data } = $props();

	const knowledgeBaseId = $derived(data.knowledgeBase.id);
	const brainId = $derived(data.openBrain.id);
</script>

<svelte:head>
	<title>{data.openBrain.name} — {data.knowledgeBase.name}</title>
</svelte:head>

<BrainViewFrame {knowledgeBaseId} brain={data.openBrain}>
	{#if data.view.kind === 'expertise'}
		<ExpertiseBrainView {knowledgeBaseId} {brainId} view={data.view} />
	{/if}
</BrainViewFrame>
