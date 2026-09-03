<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	const tracker = new FormTracker();
</script>

<form
	method="POST"
	action="?/inviteMember"
	use:enhance={tracker.submit()}
	class="flex flex-col gap-2"
>
	<div class="flex items-center gap-2">
		<input
			type="email"
			name="email"
			required
			placeholder="worker@company.co.uk"
			class="w-64 max-w-full rounded-xl border border-hairline bg-night px-4 py-2 text-sm
				text-chalk outline-none focus:border-signal"
		/>
		<SubmitButton isSaving={tracker.isSaving} savingLabel="Inviting…">Invite</SubmitButton>
	</div>
	<FormErrorNote message={tracker.errorMessage} />
</form>
