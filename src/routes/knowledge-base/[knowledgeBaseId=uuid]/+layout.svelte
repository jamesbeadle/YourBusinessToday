<script lang="ts">
	import KbDashboard from '$lib/components/knowledge/KbDashboard.svelte';

	let { data, children } = $props();
</script>

<KbDashboard
	knowledgeBase={data.knowledgeBase}
	isOwner={data.isOwner}
	brains={data.brains}
	processMaps={data.processMaps}
	shares={data.shares}
	chatbots={data.chatbots}
	workbench={data.workbench}
/>

{@render children()}
