<script lang="ts">
	import { enhance } from '$app/forms';
	import { taskStatusLabels, type TaskStatus } from '$lib/data/taskStatus';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let { task, staffMembers }: { task: ProjectTask; staffMembers: StaffMember[] } = $props();

	const statusOptions = Object.entries(taskStatusLabels) as [TaskStatus, string][];
	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<form
	method="POST"
	action="?/saveTask"
	use:enhance
	class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6"
>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Title</span>
		<input name="title" required value={task.title} class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Details</span>
		<textarea
			name="details"
			rows="4"
			placeholder="Context, links, acceptance criteria — anything Claude or the team needs"
			class={fieldClasses}>{task.details}</textarea>
	</label>
	<div class="grid gap-4 sm:grid-cols-3">
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
		<label class="flex flex-col gap-1">
			<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Assignee</span>
			<select name="assigneeId" value={task.assigneeId ?? ''} class={fieldClasses}>
				<option value="">Unassigned</option>
				{#each staffMembers as staffMember (staffMember.id)}
					<option value={staffMember.id}>{staffMember.name}</option>
				{/each}
			</select>
		</label>
	</div>
	<button
		type="submit"
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Save
	</button>
</form>
