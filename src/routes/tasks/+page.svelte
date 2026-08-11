<script lang="ts">
	import GlobalTaskFilter from '$lib/components/tasks/GlobalTaskFilter.svelte';
	import GlobalTaskPagination from '$lib/components/tasks/GlobalTaskPagination.svelte';
	import GlobalTaskRow from '$lib/components/tasks/GlobalTaskRow.svelte';
	import TasksPageHeader from '$lib/components/tasks/TasksPageHeader.svelte';
	import TaskStatusModal from '$lib/components/projects/TaskStatusModal.svelte';
	import { ListReorder } from '$lib/client/listReorder.svelte';
	import { postListReorder } from '$lib/client/postListReorder';
	import type { GlobalTask } from '$lib/server/projects/getGlobalTaskPage';

	let { data } = $props();

	const listReorder = new ListReorder((movedTaskId, targetTaskId, placement) =>
		postListReorder('?/placeTask', { movedTaskId, targetTaskId, placement })
	);

	let isStatusModalOpen = $state(false);
	let statusTask = $state<GlobalTask | null>(null);

	function openStatusModal(task: GlobalTask) {
		statusTask = task;
		isStatusModalOpen = true;
	}

	const isOwnList = $derived(data.viewedStaffMember.id === data.currentUserId);
	const viewedUserId = $derived(isOwnList ? null : data.viewedStaffMember.id);
	const taskCountLabel = $derived(
		`${data.taskPage.taskCount} ${data.shouldIncludeDone ? 'task' : 'open task'}${
			data.taskPage.taskCount === 1 ? '' : 's'
		}`
	);
</script>

<svelte:head>
	<title>Tasks — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<TasksPageHeader
		staffMembers={data.staffMembers}
		viewedStaffMember={data.viewedStaffMember}
		currentUserId={data.currentUserId}
		shouldIncludeDone={data.shouldIncludeDone}
	/>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<GlobalTaskFilter shouldIncludeDone={data.shouldIncludeDone} {viewedUserId} />
		<p class="font-display text-sm text-chalk/50">{taskCountLabel}</p>
	</div>
	{#if data.taskPage.tasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No tasks here — add one from a project, or switch the filter to All.
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.taskPage.tasks as task, taskIndex (task.id)}
				<GlobalTaskRow
					{task}
					{listReorder}
					positionNumber={data.taskPage.firstTaskNumber + taskIndex}
					isFirst={data.taskPage.firstTaskNumber + taskIndex === 1}
					isLast={data.taskPage.firstTaskNumber + taskIndex === data.taskPage.taskCount}
					shouldIncludeDone={data.shouldIncludeDone}
					onChangeStatus={openStatusModal}
				/>
			{/each}
		</ol>
		<GlobalTaskPagination
			pageNumber={data.taskPage.pageNumber}
			pageCount={data.taskPage.pageCount}
			shouldIncludeDone={data.shouldIncludeDone}
			{viewedUserId}
		/>
	{/if}
</div>

{#if statusTask !== null}
	<TaskStatusModal
		taskId={statusTask.id}
		taskTitle={statusTask.title}
		currentStatus={statusTask.status}
		bind:isOpen={isStatusModalOpen}
	/>
{/if}
