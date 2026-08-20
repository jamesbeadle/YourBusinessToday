<script lang="ts">
	import BrainDashboard from '$lib/components/brain/dashboard/BrainDashboard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.brain.name} — Your Business Today</title>
</svelte:head>

<BrainDashboard
	brain={data.brain}
	isOwner={data.isOwner}
	contexts={data.contexts}
	pageIndex={data.pageIndex}
	pageLinks={data.pageLinks}
	sources={data.sources}
	events={data.events}
	conversation={data.conversation}
	proposals={data.proposals}
	shares={data.shares}
/>
