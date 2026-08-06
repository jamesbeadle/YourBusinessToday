<script lang="ts">
	import PriorityControls from './PriorityControls.svelte';
	import ProjectActionsMenu from './ProjectActionsMenu.svelte';
	import ProjectStatusBadge from './ProjectStatusBadge.svelte';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let {
		project,
		positionNumber,
		isFirst,
		isLast,
		onEdit,
		onDelete
	}: {
		project: ProjectSummary;
		positionNumber: number;
		isFirst: boolean;
		isLast: boolean;
		onEdit: (project: ProjectSummary) => void;
		onDelete: (project: ProjectSummary) => void;
	} = $props();
</script>

<li class="flex flex-col gap-3 p-4">
	<div class="flex items-start justify-between gap-3">
		<a href={`/projects/${project.id}`} class="group flex min-w-0 flex-col gap-0.5">
			<span class="font-display font-medium transition group-hover:text-go">
				<span class="text-chalk/40">{positionNumber}.</span>
				{project.name}
			</span>
			{#if project.description !== ''}
				<span class="text-sm text-chalk/50">{project.description}</span>
			{/if}
		</a>
		<ProjectStatusBadge status={project.status} />
	</div>
	<div class="flex items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<PriorityControls
				moveAction="?/moveProject"
				fieldName="projectId"
				id={project.id}
				{isFirst}
				{isLast}
			/>
			<span class="font-display text-sm text-chalk/60">
				{project.openTaskCount} open {project.openTaskCount === 1 ? 'task' : 'tasks'}
			</span>
		</div>
		<ProjectActionsMenu
			projectName={project.name}
			onEdit={() => onEdit(project)}
			onDelete={() => onDelete(project)}
		/>
	</div>
</li>
