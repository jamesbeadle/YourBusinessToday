<script module lang="ts">
	export type FeatureGoalField = {
		name: string;
		label: string;
		placeholder: string;
	};
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let {
		createAction,
		createPlaceholder,
		createLabel,
		goalField
	}: {
		createAction: string;
		createPlaceholder: string;
		createLabel: string;
		goalField?: FeatureGoalField;
	} = $props();

	const tracker = new FormTracker();
</script>

<FormErrorNote message={tracker.errorMessage} />
<form
	method="POST"
	action={createAction}
	use:enhance={tracker.submit()}
	class={goalField === undefined ? 'flex gap-2' : 'flex flex-col gap-2'}
>
	<input
		name="name"
		required
		placeholder={createPlaceholder}
		aria-label={`${createLabel} name`}
		class="min-w-0 flex-1 rounded-full border border-hairline bg-night px-4 py-2.5 text-sm
			text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
	/>
	{#if goalField !== undefined}
		<textarea
			name={goalField.name}
			required
			rows="3"
			placeholder={goalField.placeholder}
			aria-label={goalField.label}
			class="min-w-0 resize-none rounded-2xl border border-hairline bg-night px-4 py-2.5 text-sm
				text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
		></textarea>
	{/if}
	<SubmitButton
		isSaving={tracker.isSaving}
		savingLabel="Creating…"
		class="{goalField === undefined ? '' : 'self-end '}rounded-full bg-signal px-5 py-2.5
			font-display text-sm font-medium text-night transition hover:brightness-110"
	>
		{createLabel}
	</SubmitButton>
</form>
