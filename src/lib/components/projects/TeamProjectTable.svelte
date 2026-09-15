<script lang="ts">
	import ProjectStatusBadge from './ProjectStatusBadge.svelte';
	import type { TeamProject } from '$lib/server/members/getTeamProjects';

	let { projects }: { projects: TeamProject[] } = $props();
</script>

<div class="rounded-2xl border border-hairline">
	<table class="w-full text-left">
		<thead class="border-b border-hairline bg-carriage">
			<tr class="font-display text-xs tracking-widest text-chalk/50 uppercase">
				<th class="rounded-tl-2xl px-4 py-3">Project</th>
				<th class="hidden px-4 py-3 sm:table-cell">Owner</th>
				<th class="w-28 px-4 py-3">Status</th>
				<th class="w-28 rounded-tr-2xl px-4 py-3 text-right whitespace-nowrap">Open tasks</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-hairline">
			{#each projects as project (project.id)}
				<tr class="group/row">
					<td class="px-4 py-3 transition group-hover/row:bg-carriage/60">
						<a href={`/projects/${project.id}`} class="group flex flex-col gap-0.5">
							<span class="font-display font-medium transition group-hover:text-go">
								{project.name}
							</span>
							<span class="text-sm text-chalk/50 sm:hidden">{project.ownerName}</span>
						</a>
					</td>
					<td class="hidden px-4 py-3 text-sm text-chalk/70 transition group-hover/row:bg-carriage/60 sm:table-cell">
						{project.ownerName}
					</td>
					<td class="px-4 py-3 transition group-hover/row:bg-carriage/60">
						<ProjectStatusBadge status={project.status} />
					</td>
					<td class="px-4 py-3 text-right font-display text-sm text-chalk/70 transition group-hover/row:bg-carriage/60">
						{project.openTaskCount}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
