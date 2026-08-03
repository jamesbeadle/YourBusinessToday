<script lang="ts">
	import TaskDueDate from './TaskDueDate.svelte';
	import TaskPriorityControls from './TaskPriorityControls.svelte';
	import TaskStatusButton from './TaskStatusButton.svelte';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		task,
		positionNumber,
		isFirst,
		isLast,
		assigneeName
	}: {
		task: ProjectTask;
		positionNumber: number;
		isFirst: boolean;
		isLast: boolean;
		assigneeName: string | null;
	} = $props();

	const isDone = $derived(task.status === 'done');
</script>

<li class="flex items-center gap-4 px-5 py-4" class:opacity-50={isDone}>
	<TaskPriorityControls taskId={task.id} {isFirst} {isLast} />
	<span class="w-6 text-right font-display text-sm text-chalk/40">{positionNumber}</span>
	<div class="min-w-0 flex-1">
		<a
			href={`/projects/${task.projectId}/tasks/${task.id}`}
			class="block truncate font-display transition hover:text-go"
		>
			{task.title}
		</a>
		{#if assigneeName !== null}
			<p class="truncate text-xs text-chalk/50">{assigneeName}</p>
		{/if}
	</div>
	{#if task.dueDate !== null}
		<TaskDueDate dueDate={task.dueDate} {isDone} />
	{/if}
	<TaskStatusButton taskId={task.id} status={task.status} />
</li>
