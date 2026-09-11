<script lang="ts">
	import AcceptanceCriteriaSection from '$lib/components/projects/AcceptanceCriteriaSection.svelte';
	import BuildPanel from '$lib/components/projects/BuildPanel.svelte';
	import ChecklistSection from '$lib/components/projects/ChecklistSection.svelte';
	import ConversationThread from '$lib/components/conversations/ConversationThread.svelte';
	import ResolveSupportTaskForm from '$lib/components/support/ResolveSupportTaskForm.svelte';
	import SubtaskList from '$lib/components/projects/SubtaskList.svelte';
	import TaskAttachmentsSection from '$lib/components/projects/TaskAttachmentsSection.svelte';
	import TaskDetailHeader from '$lib/components/projects/TaskDetailHeader.svelte';
	import TaskOverviewPanel from '$lib/components/projects/TaskOverviewPanel.svelte';
	import TaskPageModals from '$lib/components/projects/TaskPageModals.svelte';

	let { data, form } = $props();

	let isEditModalOpen = $state(false);
	let isSubtaskModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);

	const phaseName = $derived(
		data.phases.find((phase) => phase.id === data.task.phaseId)?.name ?? null
	);
	const goalTitle = $derived(
		data.goals.find((goal) => goal.id === data.task.goalId)?.title ?? null
	);
	const isAwaitingResolution = $derived(
		data.task.kind === 'support' && data.task.status !== 'done'
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
	<TaskDetailHeader project={data.project} parentTask={data.parentTask} taskTitle={data.task.title} />
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	<TaskOverviewPanel
		task={data.task}
		{phaseName}
		{goalTitle}
		{assigneeNames}
		raisedByName={data.raisedByName}
		onEdit={() => (isEditModalOpen = true)}
	/>
	{#if isAwaitingResolution}
		<ResolveSupportTaskForm />
	{/if}
	<AcceptanceCriteriaSection criteria={data.criteria} />
	{#if data.project.repositoryUrl !== ''}
		<BuildPanel task={data.task} project={data.project} />
	{/if}
	<SubtaskList subtasks={data.subtasks} onAddSubtask={() => (isSubtaskModalOpen = true)} />
	<ChecklistSection checklists={data.checklists} />
	<TaskAttachmentsSection
		attachments={data.attachments}
		projectId={data.project.id}
		taskId={data.task.id}
	/>
	<ConversationThread messages={data.messages} canMarkInternal />
	<button
		type="button"
		onclick={() => (isDeleteModalOpen = true)}
		class="self-end rounded-full border border-hairline px-5 py-2 font-display text-sm
			text-chalk/60 transition hover:border-signal hover:text-signal"
	>
		Delete task…
	</button>
</div>

<TaskPageModals
	task={data.task}
	parentTask={data.parentTask}
	siblingTasks={data.siblingTasks}
	staffMembers={data.staffMembers}
	phases={data.phases}
	goals={data.goals}
	assigneeIds={data.assigneeIds}
	roles={data.roles}
	bind:isEditModalOpen
	bind:isSubtaskModalOpen
	bind:isDeleteModalOpen
/>
