<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses } from '$lib/components/site/formStyles';
	import type { ApproachDraft } from '$lib/server/clients/draftApproach';

	let { draft }: { draft: ApproachDraft } = $props();
</script>

<form method="POST" action="?/saveApproach" class="flex flex-col gap-4">
	<input type="hidden" name="contactId" value={draft.contactId} />
	<p class="text-sm text-chalk/60">
		Drafted for {draft.contactName} from the company profile and their notes. Edit freely, then
		save it to their notes.
	</p>
	<FormField label="Opening message">
		<textarea name="openingMessage" rows="8" value={draft.openingMessage} class={inputClasses}
		></textarea>
	</FormField>
	<FormField label="Call plan">
		<textarea name="callPlan" rows="8" value={draft.callPlan} class={inputClasses}></textarea>
	</FormField>
	<SubmitButton>Save to notes</SubmitButton>
</form>
