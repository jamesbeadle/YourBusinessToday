<script lang="ts">
	import TaskListRow from './TaskListRow.svelte';
	import type { ListReorder } from '$lib/client/listReorder.svelte';
	import type { TaskGroup } from './taskTreeGroups';
	import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

	let {
		group,
		projectId,
		listReorder,
		assigneeNamesFor,
		goalTitleFor,
		onAddSubtask,
		onChangeStatus,
		onChangeGoal
	}: {
		group: TaskGroup;
		projectId: string;
		listReorder: ListReorder;
		assigneeNamesFor: (taskId: string) => string[];
		goalTitleFor: (goalId: string | null) => string | null;
		onAddSubtask: (parentTask: TaskTreeNode) => void;
		onChangeStatus: (task: TaskTreeNode) => void;
		onChangeGoal: (task: TaskTreeNode) => void;
	} = $props();

	const taskCountLabel = $derived(
		group.tasks.length === 1 ? '1 task' : `${group.tasks.length} tasks`
	);
</script>

<section class="flex flex-col gap-2">
	<div class="flex items-baseline justify-between gap-4 px-1">
		{#if group.goal === null}
			<h3 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Other tasks</h3>
		{:else}
			<a
				href={`/projects/${projectId}/goals/${group.goal.id}`}
				class="truncate font-display text-sm tracking-widest text-go uppercase transition hover:brightness-125"
			>
				{group.goal.title}
			</a>
		{/if}
		<span class="shrink-0 text-xs text-chalk/40">{taskCountLabel}</span>
	</div>
	<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
		{#each group.tasks as task, taskIndex (task.id)}
			<TaskListRow
				{task}
				numberPath={`${taskIndex + 1}`}
				isFirst={taskIndex === 0}
				isLast={taskIndex === group.tasks.length - 1}
				{listReorder}
				{assigneeNamesFor}
				{goalTitleFor}
				{onAddSubtask}
				{onChangeStatus}
				{onChangeGoal}
			/>
		{/each}
	</ol>
</section>
