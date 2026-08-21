<script lang="ts">
	import EntityActionsMenu from '$lib/components/workspace/EntityActionsMenu.svelte';
	import EntityFeaturePanel from '$lib/components/workspace/EntityFeaturePanel.svelte';
	import EntityTabBar from '$lib/components/workspace/EntityTabBar.svelte';
	import type { EntityTab } from '$lib/components/workspace/EntityTabBar.svelte';

	let { data } = $props();

	let activeTab = $state<EntityTab>('domains');
</script>

<svelte:head>
	<title>{data.entity.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
	<a href="/workspace" class="font-display text-sm text-chalk/60 transition hover:text-chalk">
		← Back to your workspace
	</a>
	<header class="flex flex-wrap items-start justify-between gap-4">
		<div class="flex flex-col gap-2">
			<p class="font-display text-sm tracking-widest text-signal uppercase">Entity</p>
			<h1 class="font-display text-3xl font-medium">{data.entity.name}</h1>
		</div>
		<EntityActionsMenu entityName={data.entity.name} />
	</header>
	<EntityTabBar
		{activeTab}
		domainBrainCount={data.domainBrains.length}
		workflowCount={data.workflows.length}
		onSelect={(tab) => (activeTab = tab)}
	/>
	{#if activeTab === 'domains'}
		<EntityFeaturePanel
			title="Domain brains"
			description="Each brain reads the documents you feed it and distils them into an abstract
				model of one domain — the concepts, not the examples."
			emptyMessage="No domain brains yet — pick a template or state your own goal, then start
				feeding it documents."
			createLabel="New domain brain"
			createHref={`/workspace/${data.entity.id}/domains/new`}
			rows={data.domainBrains}
			hrefFor={(id) => `/workspace/${data.entity.id}/domains/${id}`}
		/>
	{:else}
		<EntityFeaturePanel
			title="Workflow maps"
			description="Talk to the agent about how the work flows and watch each workflow drawn as a
				transit map."
			emptyMessage="No workflows yet — name one and start describing how the work moves."
			createAction="?/createWorkflow"
			createPlaceholder="Winning a job, running a build, invoicing…"
			createLabel="Create workflow"
			rows={data.workflows}
			hrefFor={(id) => `/workspace/${data.entity.id}/workflows/${id}`}
		/>
	{/if}
</div>
