<script lang="ts">
	import { enhance } from '$app/forms';
	import EmailSignInForm from '$lib/components/account/EmailSignInForm.svelte';
	import OAuthSignInButtons from '$lib/components/account/OAuthSignInButtons.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let { form } = $props();

	const resendTracker = new FormTracker();
</script>

<svelte:head>
	<title>Sign in — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Sign in</h1>
		<p class="text-chalk/70">New here? Use the same form and choose “Create account”.</p>
	</div>
	<OAuthSignInButtons />
	<div class="flex items-center gap-4 text-xs tracking-widest text-chalk/40 uppercase">
		<span class="h-px flex-1 bg-hairline"></span>
		or with email
		<span class="h-px flex-1 bg-hairline"></span>
	</div>
	<EmailSignInForm message={form?.message ?? null} isSuccess={form?.isSuccess ?? false} />
	{#if form?.unverifiedEmail}
		<form method="POST" action="?/resendVerification" use:enhance={resendTracker.submit()}>
			<input type="hidden" name="email" value={form.unverifiedEmail} />
			<SubmitButton
				isSaving={resendTracker.isSaving}
				savingLabel="Sending…"
				class="font-display text-sm text-signal underline underline-offset-4 transition
					hover:brightness-110"
			>
				Resend the verification email
			</SubmitButton>
		</form>
	{/if}
</div>
