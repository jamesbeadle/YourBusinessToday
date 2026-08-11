<script lang="ts">
	import PriorityControls from './PriorityControls.svelte';
	import ProjectActionsMenu from './ProjectActionsMenu.svelte';
	import ProjectStatusBadge from './ProjectStatusBadge.svelte';
	import ReorderableRow from '$lib/components/site/ReorderableRow.svelte';
	import type { ListReorder } from '$lib/client/listReorder.svelte';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let {
		project,
		listReorder,
		positionNumber,
		isFirst,
		isLast,
		isLastOnPage,
		onEdit,
		onDelete
	}: {
		project: ProjectSummary;
		listReorder: ListReorder;
		positionNumber: number;
		isFirst: boolean;
		isLast: boolean;
		isLastOnPage: boolean;
		onEdit: (project: ProjectSummary) => void;
		onDelete: (project: ProjectSummary) => void;
	} = $props();
</script>

<ReorderableRow {listReorder} rowId={project.id} tag="tr" class="group/row">
	{#snippet children(dragHandle)}
		<td
			class="px-4 py-3 transition group-hover/row:bg-carriage/60"
			class:rounded-bl-2xl={isLastOnPage}
		>
			<div class="flex items-center gap-2">
				{@render dragHandle()}
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
		<td class="px-4 py-3 transition group-hover/row:bg-carriage/60">
			<a href={`/projects/${project.id}`} class="group flex flex-col gap-0.5">
				<span class="font-display font-medium transition group-hover:text-go">{project.name}</span>
				{#if project.description !== ''}
					<span class="text-sm text-chalk/50">{project.description}</span>
				{/if}
			</a>
		</td>
		<td class="px-4 py-3 transition group-hover/row:bg-carriage/60">
			<ProjectStatusBadge status={project.status} />
		</td>
		<td
			class="px-4 py-3 text-right font-display text-sm text-chalk/70 transition
				group-hover/row:bg-carriage/60"
		>
			{project.openTaskCount}
		</td>
		<td
			class="px-4 py-3 text-right transition group-hover/row:bg-carriage/60"
			class:rounded-br-2xl={isLastOnPage}
		>
			<div class="flex justify-end">
				<ProjectActionsMenu
					projectName={project.name}
					onEdit={() => onEdit(project)}
					onDelete={() => onDelete(project)}
				/>
			</div>
		</td>
	{/snippet}
</ReorderableRow>
