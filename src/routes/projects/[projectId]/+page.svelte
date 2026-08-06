<script lang="ts">
	import Modal from '$lib/components/site/Modal.svelte';
	import NewTaskForm from '$lib/components/projects/NewTaskForm.svelte';
	import PhaseListPanel from '$lib/components/projects/PhaseListPanel.svelte';
	import ProjectDetailHeader from '$lib/components/projects/ProjectDetailHeader.svelte';
	import TaskListRow from '$lib/components/projects/TaskListRow.svelte';
	import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

	let { data, form } = $props();

	let isTaskModalOpen = $state(false);
	let subtaskParent = $state<TaskTreeNode | null>(null);

	function openNewTaskModal() {
		subtaskParent = null;
		isTaskModalOpen = true;
	}

	function openSubtaskModal(parentTask: TaskTreeNode) {
		subtaskParent = parentTask;
		isTaskModalOpen = true;
	}

	function assigneeNamesFor(taskId: string): string[] {
		const assigneeIds = data.assigneeIdsByTask[taskId] ?? [];
		return data.staffMembers
			.filter((staffMember) => assigneeIds.includes(staffMember.id))
			.map((staffMember) => staffMember.name);
	}

	function phaseNameFor(phaseId: string | null): string | null {
		const phase = data.phaseSummaries.find((phaseSummary) => phaseSummary.id === phaseId);
		return phase?.name ?? null;
	}

	const modalTitle = $derived(
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
	{#if data.taskTree.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No tasks yet — add the first one. The list stays ordered by priority.
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.taskTree as task, taskIndex (task.id)}
				<TaskListRow
					{task}
					numberPath={`${taskIndex + 1}`}
					isFirst={taskIndex === 0}
					isLast={taskIndex === data.taskTree.length - 1}
					{assigneeNamesFor}
					{phaseNameFor}
					onAddSubtask={openSubtaskModal}
				/>
			{/each}
		</ol>
	{/if}
</div>

<Modal title={modalTitle} bind:isOpen={isTaskModalOpen}>
	<NewTaskForm
		parentTaskId={subtaskParent?.id ?? null}
		onCreated={() => (isTaskModalOpen = false)}
	/>
</Modal>
