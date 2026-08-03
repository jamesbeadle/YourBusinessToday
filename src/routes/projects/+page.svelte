<script lang="ts">
	import NewProjectForm from '$lib/components/projects/NewProjectForm.svelte';
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte';

	let { data, form } = $props();

	const activeProjects = $derived(data.projects.filter((project) => !project.isArchived));
	const archivedProjects = $derived(data.projects.filter((project) => project.isArchived));
</script>

<svelte:head>
	<title>Projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Projects</h1>
		<p class="text-chalk/70">
			Every project the team is working on, with its backlog ordered by priority — the top of
			each list is the next thing to spend Claude on.
		</p>
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	<NewProjectForm />
	{#if activeProjects.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No projects yet — create the first one above.
		</p>
	{:else}
		<ul class="grid gap-4 md:grid-cols-2">
			{#each activeProjects as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</ul>
	{/if}
	{#if archivedProjects.length > 0}
		<div class="flex flex-col gap-3">
			<h2 class="font-display text-xl font-medium text-chalk/60">Archived</h2>
			<ul class="grid gap-4 opacity-60 md:grid-cols-2">
				{#each archivedProjects as project (project.id)}
					<ProjectCard {project} />
				{/each}
			</ul>
		</div>
	{/if}
</div>
