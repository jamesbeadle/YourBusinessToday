<script lang="ts">
	import { enhance } from '$app/forms';
	import TaskPlanningFields from './TaskPlanningFields.svelte';
	import TeamPickerFieldset from './TeamPickerFieldset.svelte';
	import UserStoryFields from './UserStoryFields.svelte';
	import { taskStatusLabels, type TaskStatus } from '$lib/data/taskStatus';
	import type { Phase } from '$lib/server/projects/phaseRecord';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
	import type { SubmitFunction } from '@sveltejs/kit';

	let {
		task,
		staffMembers,
		phases,
		assigneeIds,
		roles,
		onSaved
	}: {
		task: ProjectTask;
		staffMembers: StaffMember[];
		phases: Phase[];
		assigneeIds: string[];
		roles: string[];
		onSaved: () => void;
	} = $props();

	const closeWhenSaved: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();
			if (result.type === 'success') onSaved();
		};
	};

	const statusOptions = Object.entries(taskStatusLabels) as [TaskStatus, string][];
	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<form method="POST" action="?/saveTask" use:enhance={closeWhenSaved} class="flex flex-col gap-4">
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Title</span>
		<input name="title" required value={task.title} class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Details</span>
		<textarea
			name="details"
			rows="4"
			placeholder="Context, links — anything Claude or the team needs"
			class={fieldClasses}>{task.details}</textarea>
	</label>
	<div class="grid gap-4 sm:grid-cols-2">
		<label class="flex flex-col gap-1">
			<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Status</span>
			<select name="status" value={task.status} class={fieldClasses}>
				{#each statusOptions as [statusValue, statusLabel] (statusValue)}
					<option value={statusValue}>{statusLabel}</option>
				{/each}
			</select>
		</label>
		<label class="flex flex-col gap-1">
			<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Due date</span>
			<input name="dueDate" type="date" value={task.dueDate ?? ''} class={fieldClasses} />
		</label>
	</div>
	<TaskPlanningFields {task} {phases} />
	<UserStoryFields {task} />
	<TeamPickerFieldset {staffMembers} {assigneeIds} {roles} />
	<button
		type="submit"
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Save
	</button>
</form>
