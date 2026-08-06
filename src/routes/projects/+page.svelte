<script lang="ts">
	import ArchivedProjectList from '$lib/components/projects/ArchivedProjectList.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewProjectForm from '$lib/components/projects/NewProjectForm.svelte';
	import ProjectTable from '$lib/components/projects/ProjectTable.svelte';

	let { data, form } = $props();

	let isNewProjectModalOpen = $state(false);

	const activeProjects = $derived(data.projects.filter((project) => !project.isArchived));
	const archivedProjects = $derived(data.projects.filter((project) => project.isArchived));
</script>

<svelte:head>
	<title>Projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-display text-3xl font-medium">Projects</h1>
			<p class="max-w-prose text-chalk/70">
				Ordered by priority — the top row is the next thing to spend Claude on.
			</p>
		</div>
		<button
			type="button"
			onclick={() => (isNewProjectModalOpen = true)}
			class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			New project
		</button>
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	{#if activeProjects.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No projects yet — create the first one.
		</p>
	{:else}
		<ProjectTable projects={activeProjects} />
	{/if}
	{#if archivedProjects.length > 0}
		<ArchivedProjectList projects={archivedProjects} />
	{/if}
</div>

<Modal title="New project" bind:isOpen={isNewProjectModalOpen}>
	<NewProjectForm onCreated={() => (isNewProjectModalOpen = false)} />
</Modal>
