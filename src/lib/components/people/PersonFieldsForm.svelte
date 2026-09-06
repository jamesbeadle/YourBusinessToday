<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import PersonProfileFields from './PersonProfileFields.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses } from '$lib/components/site/formStyles';
	import type { Person } from '$lib/server/people/personRecord';

	let {
		person,
		contactId = null,
		role = ''
	}: { person: Person; contactId?: string | null; role?: string } = $props();
</script>

<form method="POST" action="?/updatePerson" class="flex flex-col gap-4">
	<input type="hidden" name="personId" value={person.id} />
	<input type="hidden" name="contactId" value={contactId ?? ''} />
	<div class="grid gap-4 sm:grid-cols-2">
		<FormField label="Name">
			<input name="name" value={person.name} required class={inputClasses} />
		</FormField>
		{#if contactId !== null}
			<FormField label="Role here">
				<input name="role" value={role} class={inputClasses} />
			</FormField>
		{/if}
		<FormField label="Email">
			<input name="email" type="email" value={person.email} class={inputClasses} />
		</FormField>
		<FormField label="Phone">
			<input name="phone" value={person.phone} class={inputClasses} />
		</FormField>
		<PersonProfileFields {person} />
	</div>
	<label class="flex items-center gap-2 text-sm text-chalk/70">
		<input type="checkbox" name="isDecisionMaker" checked={person.isDecisionMaker} class="accent-go" />
		Decides whether to buy
	</label>
	<SubmitButton>Save {person.name}</SubmitButton>
</form>
