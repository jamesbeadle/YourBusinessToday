<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import {
		confirmButtonClasses,
		dangerButtonClasses,
		inputClasses
	} from '$lib/components/site/formStyles';
</script>

<form method="POST" action="?/decide" class="flex flex-col gap-3">
	<FormField label="What should they be told?">
		<textarea name="note" rows="2" class={inputClasses}></textarea>
	</FormField>
	<div class="flex flex-wrap gap-3">
		<button type="submit" name="decision" value="accepted" class={confirmButtonClasses}>
			Accept
		</button>
		<button type="submit" name="decision" value="declined" class={dangerButtonClasses}>
			Decline
		</button>
	</div>
</form>
