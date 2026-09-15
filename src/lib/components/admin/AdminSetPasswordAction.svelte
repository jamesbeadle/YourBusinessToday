<script lang="ts">
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { minimumPasswordLength } from '$lib/data/passwordRules';

	let { targetEmail, onDone }: { targetEmail: string; onDone: () => void } = $props();

	let isChoosing = $state(false);
	const tracker = new FormTracker();

	function startChoosing() {
		tracker.reset();
		isChoosing = true;
	}
</script>

{#if !isChoosing}
	<button
		type="button"
		onclick={startChoosing}
		class="w-full rounded-xl px-3 py-2 text-left font-display text-sm text-chalk/80 transition
			hover:bg-hairline/40 hover:text-chalk"
	>
		Set password
	</button>
{:else}
	<form
		method="POST"
		action="?/setPassword"
		use:enhance={tracker.submit(onDone, { shouldKeepFields: true })}
		class="flex flex-col gap-2 px-3 py-2"
	>
		<input type="hidden" name="targetEmail" value={targetEmail} />
		<input
			type="password"
			name="password"
			autocomplete="new-password"
			minlength={minimumPasswordLength}
			placeholder={`At least ${minimumPasswordLength} characters`}
			required
			class="w-full rounded-xl border border-hairline bg-transparent px-3 py-1.5 text-sm
				text-chalk placeholder:text-chalk/40 focus:border-go focus:outline-none"
		/>
		{#if tracker.errorMessage}
			<p class="text-xs text-signal">{tracker.errorMessage}</p>
		{/if}
		<button
			type="submit"
			disabled={tracker.isSaving}
			class={`w-full rounded-full bg-go px-3 py-1.5 font-display text-sm text-night transition
				hover:bg-go/90 disabled:opacity-50 ${tracker.isSaving ? 'animate-pulse' : ''}`}
		>
			{tracker.isSaving ? 'Saving…' : 'Set this password'}
		</button>
	</form>
{/if}
