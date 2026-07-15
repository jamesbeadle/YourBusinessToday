<script lang="ts">
	import { enhance } from '$app/forms';
	import OAuthSignInButtons from '$lib/components/account/OAuthSignInButtons.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Sign in — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Sign in</h1>
		<p class="text-chalk/70">
			New here? Use the same form and choose “Create account” — you start with 300 free credits.
		</p>
	</div>
	<OAuthSignInButtons />
	<div class="flex items-center gap-4 text-xs tracking-widest text-chalk/40 uppercase">
		<span class="h-px flex-1 bg-hairline"></span>
		or with email
		<span class="h-px flex-1 bg-hairline"></span>
	</div>
	<form method="POST" action="?/signIn" use:enhance class="flex flex-col gap-4">
		<label class="flex flex-col gap-1.5">
			<span class="font-display text-sm text-chalk/80">Email</span>
			<input
				name="email"
				type="email"
				required
				autocomplete="email"
				class="rounded-xl border border-hairline bg-carriage px-4 py-3 outline-none focus:border-signal"
			/>
		</label>
		<label class="flex flex-col gap-1.5">
			<span class="font-display text-sm text-chalk/80">Password</span>
			<input
				name="password"
				type="password"
				required
				minlength="8"
				autocomplete="current-password"
				class="rounded-xl border border-hairline bg-carriage px-4 py-3 outline-none focus:border-signal"
			/>
		</label>
		{#if form?.message}
			<p
				class={`rounded-xl border px-4 py-3 text-sm
					${form.isSuccess ? 'border-go/50 bg-go/10 text-go' : 'border-caution/50 bg-caution/10 text-caution'}`}
			>
				{form.message}
			</p>
		{/if}
		<div class="flex flex-wrap gap-3">
			<button
				type="submit"
				class="rounded-full bg-signal px-7 py-3 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Sign in
			</button>
			<button
				type="submit"
				formaction="?/signUp"
				class="rounded-full border border-hairline px-7 py-3 font-display text-sm text-chalk/80
					transition hover:border-chalk/40 hover:text-chalk"
			>
				Create account
			</button>
		</div>
	</form>
	{#if form?.unverifiedEmail}
		<form method="POST" action="?/resendVerification" use:enhance>
			<input type="hidden" name="email" value={form.unverifiedEmail} />
			<button
				type="submit"
				class="font-display text-sm text-signal underline underline-offset-4 transition
					hover:brightness-110"
			>
				Resend the verification email
			</button>
		</form>
	{/if}
</div>
