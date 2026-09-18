<script lang="ts">
	import TaskDueDate from './TaskDueDate.svelte';
	import { taskStatusLabelFor } from '$lib/data/taskKind';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		task,
		goalTitle,
		assigneeNames
	}: {
		task: ProjectTask;
		goalTitle: string | null;
		assigneeNames: string[];
	} = $props();

	const isDone = $derived(task.status === 'done');
	const factClasses = 'flex flex-col gap-1';
	const factLabelClasses = 'font-display text-xs tracking-widest text-chalk/50 uppercase';
</script>

<div class="flex flex-wrap gap-x-8 gap-y-4">
	<div class={factClasses}>
		<span class={factLabelClasses}>Status</span>
		<span class="font-display text-sm">{taskStatusLabelFor(task.kind, task.status)}</span>
	</div>
	<div class={factClasses}>
		<span class={factLabelClasses}>Goal</span>
		<span class="font-display text-sm">{goalTitle ?? '—'}</span>
	</div>
	<div class={factClasses}>
		<span class={factLabelClasses}>Due</span>
		{#if task.dueDate !== null}
			<TaskDueDate dueDate={task.dueDate} {isDone} />
		{:else}
			<span class="font-display text-sm text-chalk/50">—</span>
		{/if}
	</div>
	<div class={factClasses}>
		<span class={factLabelClasses}>Priority</span>
		<span class="font-display text-sm">
			{task.priority}{task.globalPriority === null ? '' : ` · queue ${task.globalPriority}`}
		</span>
	</div>
	<div class={factClasses}>
		<span class={factLabelClasses}>Points</span>
		<span class="font-display text-sm">{task.storyPoints}</span>
	</div>
	<div class={factClasses}>
		<span class={factLabelClasses}>Complete</span>
		<span class="font-display text-sm">{task.completionPercent}%</span>
	</div>
	<div class={factClasses}>
		<span class={factLabelClasses}>Assignees</span>
		<span class="font-display text-sm">
			{assigneeNames.length > 0 ? assigneeNames.join(', ') : 'Unassigned'}
		</span>
	</div>
</div>
