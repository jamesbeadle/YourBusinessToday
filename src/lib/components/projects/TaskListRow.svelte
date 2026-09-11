<script lang="ts">
	import PriorityControls from './PriorityControls.svelte';
	import ReorderableRow from '$lib/components/site/ReorderableRow.svelte';
	import TaskDueDate from './TaskDueDate.svelte';
	import TaskGoalButton from './TaskGoalButton.svelte';
	import TaskListRow from './TaskListRow.svelte';
	import TaskMetaBadges from './TaskMetaBadges.svelte';
	import TaskStatusButton from './TaskStatusButton.svelte';
	import type { ListReorder } from '$lib/client/listReorder.svelte';
	import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

	let {
		task,
		numberPath,
		isFirst,
		isLast,
		listReorder,
		assigneeNamesFor,
		goalTitleFor,
		onAddSubtask,
		onChangeStatus,
		onChangeGoal
	}: {
		task: TaskTreeNode;
		numberPath: string;
		isFirst: boolean;
		isLast: boolean;
		listReorder: ListReorder;
		assigneeNamesFor: (taskId: string) => string[];
		goalTitleFor: (goalId: string | null) => string | null;
		onAddSubtask: (parentTask: TaskTreeNode) => void;
		onChangeStatus: (task: TaskTreeNode) => void;
		onChangeGoal: (task: TaskTreeNode) => void;
	} = $props();

	const isDone = $derived(task.status === 'done');
	const assigneeSubtitle = $derived(assigneeNamesFor(task.id).join(', '));
</script>

<ReorderableRow {listReorder} rowId={task.id} groupId={task.parentTaskId}>
	{#snippet children(dragHandle)}
		<div
			class="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-5"
			class:opacity-50={isDone}
		>
			{@render dragHandle()}
			<PriorityControls moveAction="?/moveTask" fieldName="taskId" id={task.id} {isFirst} {isLast} />
			<span class="min-w-8 text-right font-display text-sm text-chalk/40">{numberPath}</span>
			<div class="min-w-0 flex-1 basis-40">
				<a
					href={`/projects/${task.projectId}/tasks/${task.id}`}
					class="block truncate font-display transition hover:text-go"
				>
					{#if task.isUserStory}<span title="User story" class="text-caution">◆</span>{/if}
					{task.title}
				</a>
				{#if assigneeSubtitle !== ''}
					<p class="truncate text-xs text-chalk/50">{assigneeSubtitle}</p>
				{/if}
			</div>
			<div class="ml-auto flex shrink-0 items-center gap-2">
				<TaskMetaBadges {task} />
				{#if task.dueDate !== null}
					<TaskDueDate dueDate={task.dueDate} {isDone} />
				{/if}
				<TaskGoalButton goalTitle={goalTitleFor(task.goalId)} onOpenPicker={() => onChangeGoal(task)} />
				<TaskStatusButton status={task.status} kind={task.kind} onOpenPicker={() => onChangeStatus(task)} />
				<button
					type="button"
					onclick={() => onAddSubtask(task)}
					title="Add subtask"
					aria-label={`Add subtask to ${task.title}`}
					class="rounded-full border border-hairline px-2.5 py-1 font-display text-xs text-chalk/50
						transition hover:border-go hover:text-go"
				>
					＋
				</button>
			</div>
		</div>
		{#if task.subtasks.length > 0}
			<ol class="ml-5 flex flex-col divide-y divide-hairline border-l border-hairline sm:ml-10">
				{#each task.subtasks as subtask, subtaskIndex (subtask.id)}
					<TaskListRow
						task={subtask}
						numberPath={`${numberPath}.${subtaskIndex + 1}`}
						isFirst={subtaskIndex === 0}
						isLast={subtaskIndex === task.subtasks.length - 1}
						{listReorder}
						{assigneeNamesFor}
						{goalTitleFor}
						{onAddSubtask}
						{onChangeStatus}
						{onChangeGoal}
					/>
				{/each}
			</ol>
		{/if}
	{/snippet}
</ReorderableRow>
