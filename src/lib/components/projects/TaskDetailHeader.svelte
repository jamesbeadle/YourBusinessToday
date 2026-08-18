<script lang="ts">
	type LinkedProject = { id: string; name: string };
	type LinkedTask = { id: string; title: string };

	let {
		project,
		parentTask,
		taskTitle
	}: { project: LinkedProject; parentTask: LinkedTask | null; taskTitle: string } = $props();
</script>

<div class="flex flex-col gap-2">
	<a
		href={`/projects/${project.id}`}
		class="font-display text-sm text-chalk/50 transition hover:text-chalk"
	>
		← {project.name}
	</a>
	{#if parentTask !== null}
		<a
			href={`/projects/${project.id}/tasks/${parentTask.id}`}
			class="font-display text-sm text-chalk/50 transition hover:text-chalk"
		>
			↳ Subtask of “{parentTask.title}”
		</a>
	{/if}
	<h1 class="font-display text-3xl font-medium">{taskTitle}</h1>
</div>
