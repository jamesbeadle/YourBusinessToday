<script lang="ts">
	import { taskStatusLabels } from '$lib/data/taskStatus';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		subtasks,
		onAddSubtask
	}: { subtasks: ProjectTask[]; onAddSubtask: () => void } = $props();
</script>

<section class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<h2 class="font-display text-xl font-medium">Subtasks</h2>
		<button
			type="button"
			onclick={onAddSubtask}
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Add subtask
		</button>
	</div>
	{#if subtasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			No subtasks yet — break this task down if it's more than one piece of work.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each subtasks as subtask (subtask.id)}
				<li>
					<a
						href={`/projects/${subtask.projectId}/tasks/${subtask.id}`}
						class="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-carriage/60"
						class:opacity-50={subtask.status === 'done'}
					>
						<span class="truncate font-display">{subtask.title}</span>
						<span class="font-display text-xs text-chalk/50">
							{taskStatusLabels[subtask.status]}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
