<script lang="ts">
	import { enhance } from '$app/forms';
	import PriorityControls from './PriorityControls.svelte';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let {
		project,
		positionNumber,
		isFirst,
		isLast
	}: {
		project: ProjectSummary;
		positionNumber: number;
		isFirst: boolean;
		isLast: boolean;
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
	<td class="px-4 py-3 text-right font-display text-sm text-chalk/70">
		{project.openTaskCount}
	</td>
	<td class="px-4 py-3 text-right">
		<form method="POST" action="?/setArchived" use:enhance class="inline-block">
			<input type="hidden" name="projectId" value={project.id} />
			<input type="hidden" name="shouldArchive" value="true" />
			<button
				type="submit"
				class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/60
					transition hover:border-caution hover:text-caution"
			>
				Archive
			</button>
		</form>
	</td>
</tr>
