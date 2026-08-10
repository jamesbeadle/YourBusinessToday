<script lang="ts">
	import ProjectMobileCard from './ProjectMobileCard.svelte';
	import ProjectTableRow from './ProjectTableRow.svelte';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let {
		projects,
		firstPositionNumber,
		projectCount,
		onEdit,
		onDelete
	}: {
		projects: ProjectSummary[];
		firstPositionNumber: number;
		projectCount: number;
		onEdit: (project: ProjectSummary) => void;
		onDelete: (project: ProjectSummary) => void;
	} = $props();
</script>

<div class="rounded-2xl border border-hairline">
	<ul class="flex flex-col divide-y divide-hairline sm:hidden">
		{#each projects as project, projectIndex (project.id)}
			<ProjectMobileCard
				{project}
				positionNumber={firstPositionNumber + projectIndex}
				isFirst={firstPositionNumber + projectIndex === 1}
				isLast={firstPositionNumber + projectIndex === projectCount}
				{onEdit}
				{onDelete}
			/>
		{/each}
	</ul>
	<table class="hidden w-full text-left sm:table">
		<thead class="border-b border-hairline bg-carriage">
			<tr class="font-display text-xs tracking-widest text-chalk/50 uppercase">
				<th class="w-16 rounded-tl-2xl px-4 py-3">Order</th>
				<th class="px-4 py-3">Project</th>
				<th class="w-28 px-4 py-3">Status</th>
				<th class="w-28 px-4 py-3 text-right whitespace-nowrap">Open tasks</th>
				<th class="w-32 rounded-tr-2xl px-4 py-3 text-right">Actions</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-hairline">
			{#each projects as project, projectIndex (project.id)}
				<ProjectTableRow
					{project}
					positionNumber={firstPositionNumber + projectIndex}
					isFirst={firstPositionNumber + projectIndex === 1}
					isLast={firstPositionNumber + projectIndex === projectCount}
					isLastOnPage={projectIndex === projects.length - 1}
					{onEdit}
					{onDelete}
				/>
			{/each}
		</tbody>
	</table>
</div>
