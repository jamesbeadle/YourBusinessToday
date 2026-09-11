<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let { canMarkInternal }: { canMarkInternal: boolean } = $props();

	const tracker = new FormTracker();
</script>

<FormErrorNote message={tracker.errorMessage} />
<form
	method="POST"
	action="?/postMessage"
	use:enhance={tracker.submit()}
	class="flex flex-col gap-3"
>
	<div class="flex items-start gap-3">
		<textarea
			name="body"
			required
			rows="2"
			placeholder="Say something to the people on this project"
			class="flex-1 rounded-xl border border-hairline bg-carriage px-4 py-2.5 text-chalk
				outline-none focus:border-go"
		></textarea>
		<SubmitButton
			isSaving={tracker.isSaving}
			savingLabel="Posting…"
			class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Post
		</SubmitButton>
	</div>
	{#if canMarkInternal}
		<label class="flex items-center gap-2 text-xs text-chalk/60">
			<input type="checkbox" name="isInternal" class="accent-caution" />
			Internal — staff only, hidden from project members
		</label>
	{/if}
</form>
