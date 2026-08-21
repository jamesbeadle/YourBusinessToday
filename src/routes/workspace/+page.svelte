<script lang="ts">
	import EntityCard from '$lib/components/workspace/EntityCard.svelte';
	import InvitationsPanel from '$lib/components/workspace/InvitationsPanel.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewEntityForm from '$lib/components/workspace/NewEntityForm.svelte';

	let { data } = $props();

	let isNewEntityModalOpen = $state(false);
</script>

<svelte:head>
	<title>Workspace — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<header class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<p class="font-display text-sm tracking-widest text-signal uppercase">Your workspace</p>
			<h1 class="font-display text-3xl font-medium">Everything you're building</h1>
			<p class="max-w-prose text-chalk/70">
				An entity is anything you want YBT to understand — a company, a family history, a
				fleet of boat engines. Each entity holds its own domain brains and workflow maps.
			</p>
		</div>
		<button
			type="button"
			onclick={() => (isNewEntityModalOpen = true)}
			class="rounded-full bg-signal px-6 py-3 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			New entity
		</button>
	</header>
	{#if data.invitations.length > 0}
		<InvitationsPanel invitations={data.invitations} />
	{/if}
	{#if data.sharedBrains.length > 0 || data.sharedWorkflows.length > 0}
		<section class="flex flex-col gap-3">
			<h2 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Shared with you</h2>
			<ul class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
				{#each data.sharedBrains as shared (shared.brainId)}
					<li>
						<a
							href={`/workspace/${shared.entityId}/domains/${shared.brainId}`}
							class="group flex flex-col gap-1 rounded-2xl border border-hairline bg-carriage p-5
								transition hover:border-chalk/30"
						>
							<span class="font-display text-base text-chalk transition group-hover:text-signal">
								{shared.brainName}
							</span>
							<span class="text-xs text-chalk/50">{shared.entityName} · shared domain brain</span>
						</a>
					</li>
				{/each}
				{#each data.sharedWorkflows as sharedWorkflow (sharedWorkflow.workflowId)}
					<li>
						<a
							href={`/shared/${sharedWorkflow.workflowId}`}
							class="group flex flex-col gap-1 rounded-2xl border border-hairline bg-carriage p-5
								transition hover:border-chalk/30"
						>
							<span class="font-display text-base text-chalk transition group-hover:text-signal">
								{sharedWorkflow.workflowName}
							</span>
							<span class="text-xs text-chalk/50">
								{sharedWorkflow.entityName} · workflow map shared by {sharedWorkflow.ownerEmail}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if data.entities.length === 0}
		<div
			class="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-hairline
				p-12 text-center"
		>
			<p class="max-w-prose text-chalk/60">
				Nothing here yet — create your first entity and start teaching YBT what it is.
			</p>
			<button
				type="button"
				onclick={() => (isNewEntityModalOpen = true)}
				class="rounded-full border border-signal/60 px-6 py-2.5 font-display text-sm text-signal
					transition hover:bg-signal hover:text-night"
			>
				Create your first entity
			</button>
		</div>
	{:else}
		<ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.entities as entity (entity.id)}
				<EntityCard {entity} />
			{/each}
		</ul>
	{/if}
</div>

<Modal title="New entity" bind:isOpen={isNewEntityModalOpen}>
	<NewEntityForm />
</Modal>
