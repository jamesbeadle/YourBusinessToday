<script lang="ts">
	import DoneTaskFilter from './DoneTaskFilter.svelte';
	import TaskGroupSection from './TaskGroupSection.svelte';
	import { ListReorder } from '$lib/client/listReorder.svelte';
	import { postListReorder } from '$lib/client/postListReorder';
	import { groupTasksByGoal } from './taskTreeGroups';
	import { withoutDoneTasks } from './taskTreeFilters';
	import type { Goal } from '$lib/server/goals/goalRecord';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
	import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

	let {
		taskTree,
		projectId,
		goals,
		staffMembers,
		assigneeIdsByTask,
		onAddSubtask,
		onChangeStatus
	}: {
		taskTree: TaskTreeNode[];
		projectId: string;
		goals: Goal[];
		staffMembers: StaffMember[];
		assigneeIdsByTask: Record<string, string[]>;
		onAddSubtask: (parentTask: TaskTreeNode) => void;
		onChangeStatus: (task: TaskTreeNode) => void;
	} = $props();

	let shouldIncludeDone = $state(false);

	const listReorder = new ListReorder(
		(movedTaskId, targetTaskId, placement) =>
			postListReorder('?/placeTask', { movedTaskId, targetTaskId, placement }),
		{ canNestRows: true }
	);

	const visibleTasks = $derived(shouldIncludeDone ? taskTree : withoutDoneTasks(taskTree));
	const taskGroups = $derived(groupTasksByGoal(visibleTasks, goals));
	const emptyStateMessage = $derived(
		taskTree.length > 0
			? 'Everything here is done — switch the filter to All to see finished tasks.'
			: 'No tasks yet — add one.'
	);

	function assigneeNamesFor(taskId: string): string[] {
		const assigneeIds = assigneeIdsByTask[taskId] ?? [];
		return staffMembers
			.filter((staffMember) => assigneeIds.includes(staffMember.id))
			.map((staffMember) => staffMember.name);
	}

</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-end">
		<DoneTaskFilter bind:shouldIncludeDone />
	</div>
	{#if visibleTasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			{emptyStateMessage}
		</p>
	{:else}
		<div class="flex flex-col gap-6">
			{#each taskGroups as group (group.goal?.id ?? 'other')}
				<TaskGroupSection
					{group}
					{projectId}
					{listReorder}
					{assigneeNamesFor}
					{onAddSubtask}
					{onChangeStatus}
				/>
			{/each}
		</div>
	{/if}
</div>
