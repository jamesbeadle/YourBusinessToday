<script lang="ts">
	import { assignableTaskRoles } from '$lib/data/taskRoles';
	import type { ProjectPerson } from '$lib/server/members/projectPersonRecord';

	let {
		people,
		assigneeIds,
		roles
	}: { people: ProjectPerson[]; assigneeIds: string[]; roles: string[] } = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<fieldset class="flex flex-col gap-2 rounded-xl border border-hairline p-4">
		<legend class="px-1 font-display text-sm tracking-widest text-chalk/50 uppercase">
			Assignees
		</legend>
		{#each people as person (person.id)}
			<label class="flex items-center gap-3 text-sm">
				<input
					type="checkbox"
					name="assigneeIds"
					value={person.id}
					checked={assigneeIds.includes(person.id)}
					class="accent-go"
				/>
				{person.name}
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
