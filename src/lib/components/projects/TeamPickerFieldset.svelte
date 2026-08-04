<script lang="ts">
	import { assignableTaskRoles } from '$lib/data/taskRoles';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let {
		staffMembers,
		assigneeIds,
		roles
	}: { staffMembers: StaffMember[]; assigneeIds: string[]; roles: string[] } = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<fieldset class="flex flex-col gap-2 rounded-xl border border-hairline p-4">
		<legend class="px-1 font-display text-sm tracking-widest text-chalk/50 uppercase">
			Assignees
		</legend>
		{#each staffMembers as staffMember (staffMember.id)}
			<label class="flex items-center gap-3 text-sm">
				<input
					type="checkbox"
					name="assigneeIds"
					value={staffMember.id}
					checked={assigneeIds.includes(staffMember.id)}
					class="accent-go"
				/>
				{staffMember.name}
			</label>
		{/each}
	</fieldset>
	<fieldset class="flex flex-col gap-2 rounded-xl border border-hairline p-4">
		<legend class="px-1 font-display text-sm tracking-widest text-chalk/50 uppercase">
			Roles needed
		</legend>
		{#each assignableTaskRoles as role (role)}
			<label class="flex items-center gap-3 text-sm">
				<input
					type="checkbox"
					name="roles"
					value={role}
					checked={roles.includes(role)}
					class="accent-go"
				/>
				{role}
			</label>
		{/each}
	</fieldset>
</div>
