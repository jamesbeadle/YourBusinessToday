<script lang="ts">
	import AcceptanceCriteriaSection from '$lib/components/projects/AcceptanceCriteriaSection.svelte';
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import NewTaskForm from '$lib/components/projects/NewTaskForm.svelte';
	import SubtaskList from '$lib/components/projects/SubtaskList.svelte';
	import TaskCommentThread from '$lib/components/projects/TaskCommentThread.svelte';
	import TaskEditForm from '$lib/components/projects/TaskEditForm.svelte';
	import TaskOverviewPanel from '$lib/components/projects/TaskOverviewPanel.svelte';

	let { data, form } = $props();

	let isEditModalOpen = $state(false);
	let isSubtaskModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);

	const phaseName = $derived(
		data.phases.find((phase) => phase.id === data.task.phaseId)?.name ?? null
	);
	const assigneeNames = $derived(
		data.staffMembers
			.filter((staffMember) => data.assigneeIds.includes(staffMember.id))
			.map((staffMember) => staffMember.name)
	);
</script>

<svelte:head>
	<title>{data.task.title} — {data.project.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a
			href={`/projects/${data.project.id}`}
			class="font-display text-sm text-chalk/50 transition hover:text-chalk"
		>
			← {data.project.name}
		</a>
		{#if data.parentTask !== null}
			<a
				href={`/projects/${data.project.id}/tasks/${data.parentTask.id}`}
				class="font-display text-sm text-chalk/50 transition hover:text-chalk"
			>
				↳ Subtask of “{data.parentTask.title}”
			</a>
		{/if}
		<h1 class="font-display text-3xl font-medium">{data.task.title}</h1>
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	<TaskOverviewPanel
		task={data.task}
		{phaseName}
		{assigneeNames}
		onEdit={() => (isEditModalOpen = true)}
	/>
	<AcceptanceCriteriaSection criteria={data.criteria} />
	<SubtaskList subtasks={data.subtasks} onAddSubtask={() => (isSubtaskModalOpen = true)} />
	<TaskCommentThread comments={data.comments} />
	<button
		type="button"
		onclick={() => (isDeleteModalOpen = true)}
		class="self-end rounded-full border border-hairline px-5 py-2 font-display text-sm
			text-chalk/60 transition hover:border-signal hover:text-signal"
	>
		Delete task…
	</button>
</div>

<Modal title="Edit task" maxWidthClass="max-w-2xl" bind:isOpen={isEditModalOpen}>
	<TaskEditForm
		task={data.task}
		parentTask={data.parentTask}
		siblingTasks={data.siblingTasks}
		staffMembers={data.staffMembers}
		phases={data.phases}
		assigneeIds={data.assigneeIds}
		roles={data.roles}
		onSaved={() => (isEditModalOpen = false)}
	/>
</Modal>

<Modal title={`New subtask of “${data.task.title}”`} bind:isOpen={isSubtaskModalOpen}>
	<NewTaskForm
		createAction="?/addSubtask"
		parentTaskId={data.task.id}
		onCreated={() => (isSubtaskModalOpen = false)}
	/>
</Modal>

<DangerConfirmModal
	title="Delete task"
	description={`This permanently deletes “${data.task.title}”, its subtasks, and their comments. This cannot be undone.`}
	action="?/deleteTask"
	fields={{}}
	submitLabel="Delete task"
	bind:isOpen={isDeleteModalOpen}
/>
