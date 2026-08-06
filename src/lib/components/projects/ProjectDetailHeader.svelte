<script lang="ts">
	import type { Project } from '$lib/server/projects/projectRecord';

	let { project, onAddTask }: { project: Project; onAddTask: () => void } = $props();
</script>

<div class="flex flex-col gap-2">
	<a href="/projects" class="font-display text-sm text-chalk/50 transition hover:text-chalk">
		← All projects
	</a>
	<div class="flex flex-wrap items-baseline justify-between gap-4">
		<h1 class="font-display text-3xl font-medium">{project.name}</h1>
		<div class="flex items-center gap-4">
			<a
				href={`/projects/${project.id}/sprints`}
				class="font-display text-sm text-chalk/60 transition hover:text-go"
			>
				Sprints →
			</a>
			<button
				type="button"
				onclick={onAddTask}
				class="rounded-full bg-go px-6 py-2 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Add task
			</button>
		</div>
	</div>
	{#if project.description !== ''}
		<p class="text-chalk/70">{project.description}</p>
	{/if}
</div>
