<script lang="ts">
	import GlobalTaskFilter from '$lib/components/tasks/GlobalTaskFilter.svelte';
	import GlobalTaskPagination from '$lib/components/tasks/GlobalTaskPagination.svelte';
	import GlobalTaskRow from '$lib/components/tasks/GlobalTaskRow.svelte';
	import TaskStatusModal from '$lib/components/projects/TaskStatusModal.svelte';
	import type { GlobalTask } from '$lib/server/projects/getGlobalTaskPage';

	let { data } = $props();

	let isStatusModalOpen = $state(false);
	let statusTask = $state<GlobalTask | null>(null);

	function openStatusModal(task: GlobalTask) {
		statusTask = task;
		isStatusModalOpen = true;
	}
</script>

<svelte:head>
	<title>Tasks — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-display text-3xl font-medium">Tasks</h1>
			<p class="max-w-prose text-chalk/70">
				Every project's tasks in one queue, ordered by global priority — the top row is the next
				thing to work on.
			</p>
		</div>
		<a
			href="/projects"
			class="rounded-full border border-hairline px-6 py-2.5 font-display text-sm text-chalk/80
				transition hover:border-go hover:text-go"
		>
			Project view
		</a>
	</div>
	<GlobalTaskFilter shouldIncludeDone={data.shouldIncludeDone} />
	{#if data.taskPage.tasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No tasks here — add one from a project, or switch the filter to All.
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.taskPage.tasks as task, taskIndex (task.id)}
				<GlobalTaskRow
					{task}
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
