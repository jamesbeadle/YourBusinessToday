<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let { onCreated }: { onCreated: () => void } = $props();

	const tracker = new FormTracker();
</script>

<form
	method="POST"
	action="?/createPhase"
	use:enhance={tracker.submit(onCreated)}
	class="flex flex-col gap-4"
>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Phase name</span>
		<input
			name="name"
			required
			placeholder="e.g. Discovery, Build, Launch"
			class="rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
				focus:border-go"
		/>
	</label>
	<FormErrorNote message={tracker.errorMessage} />
	<SubmitButton
		isSaving={tracker.isSaving}
		savingLabel="Adding…"
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Add phase
	</SubmitButton>
</form>
