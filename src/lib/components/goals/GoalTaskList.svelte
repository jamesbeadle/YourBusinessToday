<script lang="ts">
	import TaskKindPill from '$lib/components/projects/TaskKindPill.svelte';
	import { taskStatusLabelFor } from '$lib/data/taskKind';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let { tasks }: { tasks: ProjectTask[] } = $props();
</script>

<section class="flex flex-col gap-3">
	<h2 class="font-display text-xl font-medium">Tasks</h2>
	{#if tasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			No tasks serve this goal yet — set the goal on a task from its edit form.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each tasks as task (task.id)}
				<li>
					<a
						href={`/projects/${task.projectId}/tasks/${task.id}`}
						class="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-carriage/60"
						class:opacity-50={task.status === 'done'}
					>
						<span class="flex min-w-0 items-center gap-2">
							<span class="truncate font-display">{task.title}</span>
							<TaskKindPill kind={task.kind} status={task.status} />
						</span>
						<span class="font-display text-xs whitespace-nowrap text-chalk/50">
							{taskStatusLabelFor(task.kind, task.status)}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
