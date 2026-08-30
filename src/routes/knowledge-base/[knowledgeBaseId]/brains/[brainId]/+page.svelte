<script lang="ts">
	import KindBrainDashboard from '$lib/components/knowledge/KindBrainDashboard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.brain.name} — {data.knowledgeBase.name}</title>
</svelte:head>

<KindBrainDashboard
	knowledgeBase={data.knowledgeBase}
	brain={data.brain}
	items={data.items}
	domainBrains={data.domainBrains}
	boundDomainBrainIds={data.boundDomainBrainIds}
	schemaTypes={data.schemaTypes}
	dddEditorHref={data.dddEditorHref}
	isOwner={data.isOwner}
/>
