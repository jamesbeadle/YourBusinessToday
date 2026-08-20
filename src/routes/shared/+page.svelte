<script lang="ts">
	let { data } = $props();

	function formatSharedDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Shared with me — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Shared with me</h1>
		<p class="text-chalk/70">Workflow maps other people have shared with your email address.</p>
	</div>
	{#if data.sharedWorkflows.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			Nothing here yet — when someone shares a workflow map with {data.userEmail}, it appears on
			this page.
		</p>
	{:else}
		<ul class="grid gap-4 md:grid-cols-2">
			{#each data.sharedWorkflows as sharedWorkflow (sharedWorkflow.workflowId)}
				<li>
					<a
						href={`/shared/${sharedWorkflow.workflowId}`}
						class="flex flex-col gap-2 rounded-2xl border border-hairline bg-carriage p-6
							transition hover:border-signal/60"
					>
						<p class="font-display text-lg font-medium">{sharedWorkflow.workflowName}</p>
						<p class="text-sm text-chalk/60">
							{sharedWorkflow.entityName} · shared by {sharedWorkflow.ownerEmail}
						</p>
						<p class="text-sm text-chalk/60">
							Version {sharedWorkflow.version} · updated {formatSharedDate(sharedWorkflow.updatedAt)}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
