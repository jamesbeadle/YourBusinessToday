<script lang="ts">
	import BrainViewFrame from '$lib/components/knowledge/dashboard/BrainViewFrame.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.openBrain.name} — {data.knowledgeBase.name}</title>
</svelte:head>

<BrainViewFrame knowledgeBaseId={data.knowledgeBase.id} brain={data.openBrain} />
