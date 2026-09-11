<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewTaskForm from './NewTaskForm.svelte';
	import TaskEditForm from './TaskEditForm.svelte';
	import type { Goal } from '$lib/server/goals/goalRecord';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let {
		task,
		parentTask,
		siblingTasks,
		staffMembers,
		goals,
		assigneeIds,
		roles,
		isEditModalOpen = $bindable(),
		isSubtaskModalOpen = $bindable(),
		isDeleteModalOpen = $bindable()
	}: {
		task: ProjectTask;
		parentTask: ProjectTask | null;
		siblingTasks: ProjectTask[];
		staffMembers: StaffMember[];
		goals: Goal[];
		assigneeIds: string[];
		roles: string[];
		isEditModalOpen: boolean;
		isSubtaskModalOpen: boolean;
		isDeleteModalOpen: boolean;
	} = $props();
</script>

<Modal title="Edit task" maxWidthClass="max-w-2xl" bind:isOpen={isEditModalOpen}>
	<TaskEditForm
		{task}
		{parentTask}
		{siblingTasks}
		{staffMembers}
		{goals}
		{assigneeIds}
		{roles}
		onSaved={() => (isEditModalOpen = false)}
	/>
</Modal>

<Modal title={`New subtask of “${task.title}”`} bind:isOpen={isSubtaskModalOpen}>
	<NewTaskForm
		createAction="?/addSubtask"
		parentTaskId={task.id}
		{goals}
		goalId={task.goalId}
		onCreated={() => (isSubtaskModalOpen = false)}
	/>
</Modal>

<DangerConfirmModal
	title="Delete task"
	description={`This permanently deletes “${task.title}”, its subtasks, and their conversations. This cannot be undone.`}
	action="?/deleteTask"
	fields={{}}
	submitLabel="Delete task"
	bind:isOpen={isDeleteModalOpen}
/>
