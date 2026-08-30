<script lang="ts">
	import KbDashboard from '$lib/components/knowledge/KbDashboard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.knowledgeBase.name} — Knowledge Base — Your Business Today</title>
</svelte:head>

<KbDashboard
	knowledgeBase={data.knowledgeBase}
	isOwner={data.isOwner}
	brains={data.brains}
	processMaps={data.processMaps}
	shares={data.shares}
	workbench={data.workbench}
/>
