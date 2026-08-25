<script lang="ts">
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { confirmButtonClasses, inputClasses } from './accountingFormStyles';

	let {
		action,
		placeholder,
		buttonLabel
	}: { action: string; placeholder: string; buttonLabel: string } = $props();

	const tracker = new FormTracker();
</script>

<form method="POST" {action} use:enhance={tracker.submit()} class="flex flex-col gap-3">
	<div class="flex flex-wrap gap-3">
		<input name="name" required {placeholder} class={`${inputClasses} min-w-64 flex-1`} />
		<SubmitButton isSaving={tracker.isSaving} savingLabel="Adding…" class={confirmButtonClasses}>
			{buttonLabel}
		</SubmitButton>
	</div>
	<FormErrorNote message={tracker.errorMessage} />
</form>
