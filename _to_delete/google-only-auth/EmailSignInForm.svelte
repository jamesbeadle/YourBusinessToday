<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { message, isSuccess }: { message: string | null; isSuccess: boolean } = $props();

	const tracker = new FormTracker();

	let isCreatingAccount = $state(false);

	const trackChosenAction: SubmitFunction = (submitEvent) => {
		isCreatingAccount = submitEvent.action.search.includes('signUp');
		return tracker.submit()(submitEvent);
	};

	const isSigningIn = $derived(tracker.isSaving && !isCreatingAccount);
	const isSigningUp = $derived(tracker.isSaving && isCreatingAccount);

	const fieldClasses =
		'rounded-xl border border-hairline bg-carriage px-4 py-3 outline-none focus:border-signal';
</script>

<form method="POST" action="?/signIn" use:enhance={trackChosenAction} class="flex flex-col gap-4">
	<label class="flex flex-col gap-1.5">
		<span class="font-display text-sm text-chalk/80">Email</span>
		<input name="email" type="email" required autocomplete="email" class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1.5">
		<span class="font-display text-sm text-chalk/80">Password</span>
		<input
			name="password"
			type="password"
			required
			minlength="8"
			autocomplete="current-password"
			class={fieldClasses}
		/>
	</label>
	{#if message !== null}
		<p
			class={`rounded-xl border px-4 py-3 text-sm
				${isSuccess ? 'border-go/50 bg-go/10 text-go' : 'border-caution/50 bg-caution/10 text-caution'}`}
		>
			{message}
		</p>
	{/if}
	<div class="flex flex-wrap gap-3">
		<SubmitButton
			isSaving={isSigningIn}
			disabled={tracker.isSaving}
			savingLabel="Signing in…"
			class="rounded-full bg-signal px-7 py-3 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Sign in
		</SubmitButton>
		<button
			type="submit"
			formaction="?/signUp"
			disabled={tracker.isSaving}
			class="rounded-full border border-hairline px-7 py-3 font-display text-sm text-chalk/80
				transition hover:border-chalk/40 hover:text-chalk disabled:cursor-not-allowed
				disabled:opacity-60"
		>
			{isSigningUp ? 'Creating account…' : 'Create account'}
		</button>
	</div>
</form>
