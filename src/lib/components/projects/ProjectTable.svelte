<script lang="ts">
	import ProjectTableRow from './ProjectTableRow.svelte';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let {
		projects,
		onEdit,
		onDelete
	}: {
		projects: ProjectSummary[];
		onEdit: (project: ProjectSummary) => void;
		onDelete: (project: ProjectSummary) => void;
	} = $props();
</script>

<div class="overflow-hidden rounded-2xl border border-hairline">
	<table class="w-full text-left">
		<thead class="border-b border-hairline bg-carriage">
			<tr class="font-display text-xs tracking-widest text-chalk/50 uppercase">
				<th class="w-16 px-4 py-3">Order</th>
				<th class="px-4 py-3">Project</th>
				<th class="w-28 px-4 py-3">Status</th>
				<th class="w-28 px-4 py-3 text-right">Open tasks</th>
				<th class="w-32 px-4 py-3 text-right">Actions</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-hairline">
			{#each projects as project, projectIndex (project.id)}
				<ProjectTableRow
					{project}
					positionNumber={projectIndex + 1}
					isFirst={projectIndex === 0}
					isLast={projectIndex === projects.length - 1}
					{onEdit}
					{onDelete}
				/>
			{/each}
		</tbody>
	</table>
</div>
