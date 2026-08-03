<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ProjectSummary } from '$lib/server/projects/getProjectList';

	let { project }: { project: ProjectSummary } = $props();

	const openTaskLabel = $derived(
		project.openTaskCount === 1 ? '1 open task' : `${project.openTaskCount} open tasks`
	);
</script>

<li
	class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6 transition
		hover:border-signal/60"
>
	<a href={`/projects/${project.id}`} class="flex flex-col gap-2">
		<p class="font-display text-lg font-medium">{project.name}</p>
		{#if project.description !== ''}
			<p class="text-sm text-chalk/60">{project.description}</p>
		{/if}
		<p class="text-sm text-chalk/50">{openTaskLabel}</p>
	</a>
	<form method="POST" action="?/setArchived" use:enhance class="self-end">
		<input type="hidden" name="projectId" value={project.id} />
		<input type="hidden" name="shouldArchive" value={project.isArchived ? 'false' : 'true'} />
		<button
			type="submit"
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/60
				transition hover:border-caution hover:text-caution"
		>
			{project.isArchived ? 'Unarchive' : 'Archive'}
		</button>
	</form>
</li>
