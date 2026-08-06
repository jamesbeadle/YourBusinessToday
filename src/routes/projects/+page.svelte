<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import EditProjectForm from '$lib/components/projects/EditProjectForm.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewProjectForm from '$lib/components/projects/NewProjectForm.svelte';
	import ProjectFilterBar from '$lib/components/projects/ProjectFilterBar.svelte';
	import ProjectTable from '$lib/components/projects/ProjectTable.svelte';
	import type { ProjectStatus } from '$lib/data/projectStatus';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let { data, form } = $props();

	let isNewProjectModalOpen = $state(false);
	let isEditModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let selectedProject = $state<ProjectSummary | null>(null);
	let searchText = $state('');
	let selectedStatus = $state<ProjectStatus | 'all'>('all');

	function openEditModal(project: ProjectSummary) {
		selectedProject = project;
		isEditModalOpen = true;
	}

	function openDeleteModal(project: ProjectSummary) {
		selectedProject = project;
		isDeleteModalOpen = true;
	}

	const visibleProjects = $derived(
		data.projects.filter(
			(project) =>
				(selectedStatus === 'all' || project.status === selectedStatus) &&
				project.name.toLowerCase().includes(searchText.trim().toLowerCase())
		)
	);
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
	<ProjectFilterBar bind:searchText bind:selectedStatus />
	{#if visibleProjects.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No projects match — adjust the filters or create one.
		</p>
	{:else}
		<ProjectTable projects={visibleProjects} onEdit={openEditModal} onDelete={openDeleteModal} />
	{/if}
</div>

<Modal title="New project" bind:isOpen={isNewProjectModalOpen}>
	<NewProjectForm onCreated={() => (isNewProjectModalOpen = false)} />
</Modal>

{#if selectedProject !== null}
	<Modal title={`Edit ${selectedProject.name}`} bind:isOpen={isEditModalOpen}>
		<EditProjectForm project={selectedProject} onSaved={() => (isEditModalOpen = false)} />
	</Modal>
	<DangerConfirmModal
		title="Delete project"
		description={`This permanently deletes “${selectedProject.name}”, every task and subtask in it, and all their comments. This cannot be undone.`}
		action="?/deleteProject"
		fields={{ projectId: selectedProject.id }}
		submitLabel="Delete project"
		confirmWord={selectedProject.name}
		bind:isOpen={isDeleteModalOpen}
	/>
{/if}
