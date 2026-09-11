<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let { onAdded }: { onAdded: () => void } = $props();

	const tracker = new FormTracker();
</script>

<form
	method="POST"
	action="?/addMember"
	use:enhance={tracker.submit(onAdded)}
	class="flex flex-col gap-4"
>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Email address</span>
		<input
			name="email"
			type="email"
			required
			placeholder="The address they sign in with"
			class="rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
				focus:border-go"
		/>
	</label>
	<p class="text-xs text-chalk/50">
		They need an account here already. Once added they reach this project's goals, tasks and
		conversations — through Claude or the portal — and nothing else.
	</p>
	<FormErrorNote message={tracker.errorMessage} />
	<SubmitButton
		isSaving={tracker.isSaving}
		savingLabel="Adding…"
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Add member
	</SubmitButton>
</form>
