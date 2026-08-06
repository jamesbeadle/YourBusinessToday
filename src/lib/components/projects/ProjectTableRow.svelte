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

<tr class="transition hover:bg-carriage/60">
	<td class="px-4 py-3">
		<div class="flex items-center gap-2">
			<PriorityControls
				moveAction="?/moveProject"
				fieldName="projectId"
				id={project.id}
				{isFirst}
				{isLast}
			/>
			<span class="font-display text-sm text-chalk/40">{positionNumber}</span>
		</div>
	</td>
	<td class="px-4 py-3">
		<a href={`/projects/${project.id}`} class="group flex flex-col gap-0.5">
			<span class="font-display font-medium transition group-hover:text-go">{project.name}</span>
			{#if project.description !== ''}
				<span class="text-sm text-chalk/50">{project.description}</span>
			{/if}
		</a>
	</td>
	<td class="px-4 py-3"><ProjectStatusBadge status={project.status} /></td>
	<td class="px-4 py-3 text-right font-display text-sm text-chalk/70">
		{project.openTaskCount}
	</td>
	<td class="px-4 py-3 text-right">
		<div class="flex justify-end">
			<ProjectActionsMenu
				projectName={project.name}
				onEdit={() => onEdit(project)}
				onDelete={() => onDelete(project)}
			/>
		</div>
	</td>
</tr>
