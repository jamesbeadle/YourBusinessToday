<script lang="ts">
	import Modal from '$lib/components/site/Modal.svelte';
	import NewTaskForm from '$lib/components/projects/NewTaskForm.svelte';
	import PhaseListPanel from '$lib/components/projects/PhaseListPanel.svelte';
	import ProjectDetailHeader from '$lib/components/projects/ProjectDetailHeader.svelte';
	import TaskStatusModal from '$lib/components/projects/TaskStatusModal.svelte';
	import TaskTreePanel from '$lib/components/projects/TaskTreePanel.svelte';
	import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

	let { data, form } = $props();

	let isTaskModalOpen = $state(false);
	let isStatusModalOpen = $state(false);
	let subtaskParent = $state<TaskTreeNode | null>(null);
	let statusTask = $state<TaskTreeNode | null>(null);

	function openNewTaskModal() {
		subtaskParent = null;
		isTaskModalOpen = true;
	}

	function openSubtaskModal(parentTask: TaskTreeNode) {
		subtaskParent = parentTask;
		isTaskModalOpen = true;
	}

	function openStatusModal(task: TaskTreeNode) {
		statusTask = task;
		isStatusModalOpen = true;
	}

	const taskModalTitle = $derived(
		subtaskParent === null ? 'New task' : `New subtask of “${subtaskParent.title}”`
	);
</script>

<svelte:head>
	<title>{data.project.name} — Projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<ProjectDetailHeader project={data.project} onAddTask={openNewTaskModal} />
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">
			{form.message}
		</p>
	{/if}
	<PhaseListPanel phaseSummaries={data.phaseSummaries} />
	<TaskTreePanel
		taskTree={data.taskTree}
		phaseSummaries={data.phaseSummaries}
		staffMembers={data.staffMembers}
		assigneeIdsByTask={data.assigneeIdsByTask}
		onAddSubtask={openSubtaskModal}
		onChangeStatus={openStatusModal}
	/>
</div>

<Modal title={taskModalTitle} bind:isOpen={isTaskModalOpen}>
	<NewTaskForm
		parentTaskId={subtaskParent?.id ?? null}
		phases={data.phaseSummaries}
		onCreated={() => (isTaskModalOpen = false)}
	/>
</Modal>

{#if statusTask !== null}
	<TaskStatusModal
		taskId={statusTask.id}
		taskTitle={statusTask.title}
		currentStatus={statusTask.status}
		bind:isOpen={isStatusModalOpen}
	/>
{/if}
