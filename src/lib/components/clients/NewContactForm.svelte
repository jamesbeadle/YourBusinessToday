<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses } from '$lib/components/site/formStyles';
</script>

<form method="POST" action="?/addContact" class="flex flex-col gap-4">
	<FormField label="Name">
		<input name="name" required class={inputClasses} />
	</FormField>
	<FormField label="Email">
		<input name="email" type="email" class={inputClasses} />
	</FormField>
	<FormField label="Role">
		<input name="role" placeholder="Operations manager" class={inputClasses} />
	</FormField>
	<FormField label="Phone">
		<input name="phone" class={inputClasses} />
	</FormField>
	<label class="flex items-center gap-2 text-sm text-chalk/70">
		<input type="checkbox" name="isPrimary" class="accent-go" />
		Main point of contact
	</label>
	<SubmitButton>Add contact</SubmitButton>
</form>
