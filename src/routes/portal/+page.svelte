<script lang="ts">
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import { projectStatusLabels } from '$lib/data/projectStatus';

	let { data } = $props();
</script>

<svelte:head>
	<title>Your projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-display text-3xl font-medium">Hello {data.memberName}</h1>
			<p class="text-chalk/70">
				The projects you work on with us. Connect your Claude to raise things, follow the
				conversation on every goal and task, and read what is new.
			</p>
		</div>
		<a href="/portal/access" class="font-display text-sm text-chalk/60 hover:text-chalk">
			Connect Claude
		</a>
	</div>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Your projects</h2>
		{#if data.projects.length === 0}
			<EmptyState message="Nothing here yet — we will add you to your projects shortly." />
		{:else}
			<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
				{#each data.projects as project (project.id)}
					<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
						<div class="min-w-0">
							<p class="font-display">{project.name}</p>
							{#if project.description !== ''}
								<p class="truncate text-xs text-chalk/50">{project.description}</p>
							{/if}
						</div>
						<span class="text-xs text-chalk/50">{projectStatusLabels[project.status]}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
