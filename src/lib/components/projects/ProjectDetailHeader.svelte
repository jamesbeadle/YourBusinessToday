<script lang="ts">
	import EditProjectForm from './EditProjectForm.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import ProjectStatusBadge from './ProjectStatusBadge.svelte';
	import type { Project } from '$lib/server/projects/projectRecord';

	let { project, onAddTask }: { project: Project; onAddTask: () => void } = $props();

	let isEditModalOpen = $state(false);
</script>

<div class="flex flex-col gap-2">
	<a href="/projects" class="font-display text-sm text-chalk/50 transition hover:text-chalk">
		← All projects
	</a>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<h1 class="font-display text-3xl font-medium">{project.name}</h1>
			<ProjectStatusBadge status={project.status} />
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => (isEditModalOpen = true)}
				class="rounded-full border border-hairline px-5 py-2 font-display text-sm text-chalk/70
					transition hover:border-go hover:text-go"
			>
				Edit
			</button>
			<button
				type="button"
				onclick={onAddTask}
				class="rounded-full bg-go px-6 py-2 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Add task
			</button>
		</div>
	</div>
	{#if project.description !== ''}
		<p class="text-chalk/70">{project.description}</p>
	{/if}
</div>

<Modal title={`Edit ${project.name}`} bind:isOpen={isEditModalOpen}>
	<EditProjectForm {project} onSaved={() => (isEditModalOpen = false)} />
</Modal>
