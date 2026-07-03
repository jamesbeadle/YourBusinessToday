<script lang="ts">
	import ShareMapPanel from '$lib/components/workspace/ShareMapPanel.svelte';
	import WorkspaceChat from '$lib/components/workspace/WorkspaceChat.svelte';
	import WorkspaceMap from '$lib/components/workspace/WorkspaceMap.svelte';
	import WorkspaceMapNotice from '$lib/components/workspace/WorkspaceMapNotice.svelte';
	import { hasMapContent, type WorkflowModel } from '$lib/data/workflowModel';

	let { data } = $props();

	let model = $state<WorkflowModel>(data.latestMap);

	const isMapDrawn = $derived(hasMapContent(model));
	const workspaceTitle = $derived(
		model.businessName === '' ? 'Tell the agent about your business' : model.businessName
	);
</script>

<svelte:head>
	<title>Workspace — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
	<header class="flex flex-col gap-2">
		<p class="font-display text-sm tracking-widest text-signal uppercase">Your workspace</p>
		<h1 class="font-display text-3xl font-medium">{workspaceTitle}</h1>
		<p class="max-w-prose text-chalk/70">
			The map redraws itself with every answer you give — every role a line, every task a
			station, every handover an interchange.
		</p>
	</header>
	{#if isMapDrawn}
		<WorkspaceMap {model} />
	{/if}
	<div class="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
		<WorkspaceChat
			initialMessages={data.messages}
			onMapUpdate={(updatedModel) => (model = updatedModel)}
		/>
		<div class="flex flex-col gap-6">
			{#if !isMapDrawn}
				<WorkspaceMapNotice creditBalance={data.creditBalance} />
			{/if}
			<ShareMapPanel viewers={data.viewers} />
		</div>
	</div>
</div>
