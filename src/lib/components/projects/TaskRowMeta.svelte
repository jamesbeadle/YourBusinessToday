<script lang="ts">
	import TaskDueDate from './TaskDueDate.svelte';
	import TaskGoalButton from './TaskGoalButton.svelte';
	import TaskMetaBadges from './TaskMetaBadges.svelte';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		task,
		assigneeNames,
		goalTitle,
		isDone,
		onChangeGoal
	}: {
		task: ProjectTask;
		assigneeNames: string[];
		goalTitle: string | null;
		isDone: boolean;
		onChangeGoal: () => void;
	} = $props();

	const assigneeLine = $derived(assigneeNames.join(', '));
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
	<TaskGoalButton {goalTitle} onOpenPicker={onChangeGoal} />
	<TaskMetaBadges {task} />
	{#if task.dueDate !== null}
		<TaskDueDate dueDate={task.dueDate} {isDone} />
	{/if}
	{#if assigneeLine !== ''}
		<span class="truncate text-xs text-chalk/50">{assigneeLine}</span>
	{/if}
</div>
