<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import EditProjectForm from '$lib/components/projects/EditProjectForm.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewProjectForm from '$lib/components/projects/NewProjectForm.svelte';
	import ProjectFilterBar from '$lib/components/projects/ProjectFilterBar.svelte';
	import ProjectPagination from '$lib/components/projects/ProjectPagination.svelte';
	import ProjectsPageHeader from '$lib/components/projects/ProjectsPageHeader.svelte';
	import ProjectTileGrid from '$lib/components/projects/ProjectTileGrid.svelte';
	import TeamProjectGrid from '$lib/components/projects/TeamProjectGrid.svelte';
	import { ProjectListView } from '$lib/client/projectListView.svelte';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let { data, form } = $props();

	let isNewProjectModalOpen = $state(false);
	let isEditModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let selectedProject = $state<ProjectSummary | null>(null);

	const listView = new ProjectListView(() => data.projects);

	function openEditModal(project: ProjectSummary) {
		selectedProject = project;
		isEditModalOpen = true;
	}

	function openDeleteModal(project: ProjectSummary) {
		selectedProject = project;
		isDeleteModalOpen = true;
	}
</script>

<svelte:head>
	<title>Projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
	<ProjectsPageHeader onNewProject={() => (isNewProjectModalOpen = true)} />
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	<div class="flex flex-col gap-2">
		<ProjectFilterBar
			bind:searchText={listView.searchText}
			bind:selectedStatus={listView.selectedStatus}
		/>
		<p class="text-right font-display text-sm text-chalk/50">{listView.countLabel}</p>
	</div>
	{#if listView.filteredProjects.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No projects match — adjust the filters or create one.
		</p>
	{:else}
		<ProjectTileGrid
			projects={listView.pagedProjects}
			firstPositionNumber={listView.firstPositionNumber}
			projectCount={listView.filteredProjects.length}
			onEdit={openEditModal}
			onDelete={openDeleteModal}
		/>
		<ProjectPagination bind:pageNumber={listView.pageNumber} pageCount={listView.pageCount} />
	{/if}
	{#if data.teamProjects.length > 0}
		<section class="flex flex-col gap-4 pt-8">
			<div class="flex flex-col gap-1">
				<h2 class="font-display text-2xl font-medium">Team projects</h2>
				<p class="text-chalk/70">Projects other people own and have brought you on to.</p>
			</div>
			<TeamProjectGrid projects={data.teamProjects} />
		</section>
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
