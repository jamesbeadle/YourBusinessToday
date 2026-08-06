<script lang="ts">
	import PhaseFilterBar from './PhaseFilterBar.svelte';
	import TaskListRow from './TaskListRow.svelte';
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

	const visibleTasks = $derived(taskTree.filter((task) => isInSelectedPhase(task.phaseId)));

	function isInSelectedPhase(phaseId: string | null): boolean {
		if (selectedPhaseId === 'all') return true;
		if (selectedPhaseId === 'none') return phaseId === null;
		return phaseId === selectedPhaseId;
	}

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
	{#if phaseSummaries.length > 0}
		<PhaseFilterBar {phaseSummaries} bind:selectedPhaseId />
	{/if}
	{#if visibleTasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No tasks here — add one, or pick a different phase filter.
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each visibleTasks as task, taskIndex (task.id)}
				<TaskListRow
					{task}
					numberPath={`${taskIndex + 1}`}
					isFirst={taskIndex === 0}
					isLast={taskIndex === visibleTasks.length - 1}
					{assigneeNamesFor}
					{phaseNameFor}
					{onAddSubtask}
					{onChangeStatus}
				/>
			{/each}
		</ol>
	{/if}
</div>
