<script lang="ts">
	import BrainDashboard from '$lib/components/brain/dashboard/BrainDashboard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.brain.name} — Your Business Today</title>
</svelte:head>

<BrainDashboard
	brain={data.brain}
	accessRole={data.accessRole}
	contexts={data.contexts}
	pageIndex={data.pageIndex}
	pageLinks={data.pageLinks}
	sources={data.sources}
	events={data.events}
	conversation={data.conversation}
	proposals={data.proposals}
	shares={data.shares}
	invites={data.invites}
	listing={data.listing}
	editions={data.editions}
	sales={data.sales}
	hive={data.hive}
	apiTokens={data.apiTokens}
/>
