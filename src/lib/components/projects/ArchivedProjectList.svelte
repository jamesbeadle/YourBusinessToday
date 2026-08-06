<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let { projects }: { projects: ProjectSummary[] } = $props();
</script>

<section class="flex flex-col gap-3">
	<h2 class="font-display text-xl font-medium text-chalk/60">Archived</h2>
	<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline opacity-70">
		{#each projects as project (project.id)}
			<li class="flex items-center justify-between gap-4 px-5 py-3">
				<a href={`/projects/${project.id}`} class="min-w-0">
					<p class="truncate font-display">{project.name}</p>
					{#if project.description !== ''}
						<p class="truncate text-sm text-chalk/50">{project.description}</p>
					{/if}
				</a>
				<form method="POST" action="?/setArchived" use:enhance>
					<input type="hidden" name="projectId" value={project.id} />
					<input type="hidden" name="shouldArchive" value="false" />
					<button
						type="submit"
						class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs
							text-chalk/60 transition hover:border-go hover:text-go"
					>
						Unarchive
					</button>
				</form>
			</li>
		{/each}
	</ul>
</section>
