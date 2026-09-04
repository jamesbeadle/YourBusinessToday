<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let { staffMembers }: { staffMembers: StaffMember[] } = $props();
</script>

<form method="POST" action="?/createClient" class="flex flex-col gap-4">
	<FormField label="Company name">
		<input name="name" required class={inputClasses} />
	</FormField>
	<FormField label="Website">
		<input name="website" placeholder="https://" class={inputClasses} />
	</FormField>
	<FormField label="Relationship owner">
		<select name="ownerId" class={selectClasses}>
			{#each staffMembers as staffMember (staffMember.id)}
				<option value={staffMember.id}>{staffMember.name}</option>
			{/each}
		</select>
	</FormField>
	<SubmitButton>Add as a lead</SubmitButton>
</form>
