<script lang="ts">
	import DoneTaskFilter from './DoneTaskFilter.svelte';
	import PhaseFilterBar from './PhaseFilterBar.svelte';
	import TaskListRow from './TaskListRow.svelte';
	import { ListReorder } from '$lib/client/listReorder.svelte';
	import { postListReorder } from '$lib/client/postListReorder';
	import { tasksInPhase, withoutDoneTasks } from './taskTreeFilters';
	import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
	import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

	let {
		taskTree,
		phaseSummaries,
		staffMembers,
		assigneeIdsByTask,
		onAddSubtask,
		onChangeStatus
	}: {
		taskTree: TaskTreeNode[];
		phaseSummaries: PhaseSummary[];
		staffMembers: StaffMember[];
		assigneeIdsByTask: Record<string, string[]>;
		onAddSubtask: (parentTask: TaskTreeNode) => void;
		onChangeStatus: (task: TaskTreeNode) => void;
	} = $props();

	let selectedPhaseId = $state('all');
	let shouldIncludeDone = $state(false);

	const listReorder = new ListReorder(
		(movedTaskId, targetTaskId, placement) =>
			postListReorder('?/placeTask', { movedTaskId, targetTaskId, placement }),
		{ canNestRows: true }
	);

	const tasksInSelectedPhase = $derived(tasksInPhase(taskTree, selectedPhaseId));
	const visibleTasks = $derived(
		shouldIncludeDone ? tasksInSelectedPhase : withoutDoneTasks(tasksInSelectedPhase)
	);
	const emptyStateMessage = $derived(
		tasksInSelectedPhase.length > 0
			? 'Everything here is done — switch the filter to All to see finished tasks.'
			: 'No tasks here — add one, or pick a different phase filter.'
	);

	function assigneeNamesFor(taskId: string): string[] {
		const assigneeIds = assigneeIdsByTask[taskId] ?? [];
		return staffMembers
			.filter((staffMember) => assigneeIds.includes(staffMember.id))
			.map((staffMember) => staffMember.name);
	}

	function phaseNameFor(phaseId: string | null): string | null {
		const phase = phaseSummaries.find((phaseSummary) => phaseSummary.id === phaseId);
		return phase?.name ?? null;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-3">
		{#if phaseSummaries.length > 0}
			<PhaseFilterBar {phaseSummaries} bind:selectedPhaseId />
		{/if}
		<div class="ml-auto">
			<DoneTaskFilter bind:shouldIncludeDone />
		</div>
	</div>
	{#if visibleTasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			{emptyStateMessage}
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each visibleTasks as task, taskIndex (task.id)}
				<TaskListRow
					{task}
					numberPath={`${taskIndex + 1}`}
					isFirst={taskIndex === 0}
					isLast={taskIndex === visibleTasks.length - 1}
					{listReorder}
					{assigneeNamesFor}
					{phaseNameFor}
					{onAddSubtask}
					{onChangeStatus}
				/>
			{/each}
		</ol>
	{/if}
</div>
