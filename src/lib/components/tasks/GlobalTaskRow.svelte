<script lang="ts">
	import PriorityControls from '$lib/components/projects/PriorityControls.svelte';
	import ReorderableRow from '$lib/components/site/ReorderableRow.svelte';
	import TaskDueDate from '$lib/components/projects/TaskDueDate.svelte';
	import TaskMetaBadges from '$lib/components/projects/TaskMetaBadges.svelte';
	import TaskStatusButton from '$lib/components/projects/TaskStatusButton.svelte';
	import type { GlobalTask } from '$lib/server/projects/getGlobalTaskPage';
	import type { ListReorder } from '$lib/client/listReorder.svelte';

	let {
		task,
		listReorder,
		positionNumber,
		isFirst,
		isLast,
		shouldIncludeDone,
		onChangeStatus
	}: {
		task: GlobalTask;
		listReorder: ListReorder;
		positionNumber: number;
		isFirst: boolean;
		isLast: boolean;
		shouldIncludeDone: boolean;
		onChangeStatus: (task: GlobalTask) => void;
	} = $props();

	const isDone = $derived(task.status === 'done');
</script>

<ReorderableRow
	{listReorder}
	rowId={task.id}
	class="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-5 {isDone
		? 'opacity-50'
		: ''}"
>
	{#snippet children(dragHandle)}
		{@render dragHandle()}
		<PriorityControls
			moveAction="?/moveTask"
			fieldName="taskId"
			id={task.id}
			extraFields={{ includeDone: String(shouldIncludeDone) }}
			{isFirst}
			{isLast}
		/>
		<span class="min-w-8 text-right font-display text-sm text-chalk/40">{positionNumber}</span>
		<div class="min-w-0 flex-1 basis-40">
			<a
				href={`/projects/${task.projectId}/tasks/${task.id}`}
				class="block truncate font-display transition hover:text-go"
			>
				{#if task.isUserStory}<span title="User story" class="text-caution">◆</span>{/if}
				{task.title}
			</a>
			<a
				href={`/projects/${task.projectId}`}
				class="block truncate text-xs text-chalk/50 transition hover:text-go"
			>
				{task.projectName}
			</a>
		</div>
		<div class="ml-auto flex shrink-0 items-center gap-2">
			<TaskMetaBadges {task} />
			{#if task.dueDate !== null}
				<TaskDueDate dueDate={task.dueDate} {isDone} />
			{/if}
			<TaskStatusButton status={task.status} onOpenPicker={() => onChangeStatus(task)} />
		</div>
	{/snippet}
</ReorderableRow>
