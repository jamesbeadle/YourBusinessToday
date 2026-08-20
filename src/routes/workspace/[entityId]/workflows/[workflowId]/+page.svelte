<script lang="ts">
	import ShareMapPanel from '$lib/components/workspace/ShareMapPanel.svelte';
	import WorkspaceChat from '$lib/components/workspace/WorkspaceChat.svelte';
	import WorkspaceMap from '$lib/components/workspace/WorkspaceMap.svelte';
	import WorkspaceMapNotice from '$lib/components/workspace/WorkspaceMapNotice.svelte';
	import { hasMapContent, type WorkflowModel } from '$lib/data/workflowModel';

	let { data } = $props();

	let model = $state<WorkflowModel>(data.latestMap);

	const isMapDrawn = $derived(hasMapContent(model));
</script>

<svelte:head>
	<title>{data.workflow.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
	<a
		href={`/workspace/${data.workflow.entityId}`}
		class="font-display text-sm text-chalk/60 transition hover:text-chalk"
	>
		← Back to the entity
	</a>
	<header class="flex flex-col gap-2">
		<p class="font-display text-sm tracking-widest text-signal uppercase">Workflow map</p>
		<h1 class="font-display text-3xl font-medium">{data.workflow.name}</h1>
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
			workflowId={data.workflow.id}
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
