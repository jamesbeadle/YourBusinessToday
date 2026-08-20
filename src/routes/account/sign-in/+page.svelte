<script lang="ts">
	import GoogleSignInButton from '$lib/components/account/GoogleSignInButton.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Sign in — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
	{#if data.isInvited}
		<div class="rounded-2xl border border-go/40 bg-go/10 px-5 py-4 text-sm text-chalk/80">
			{#if data.invitedBy !== ''}
				<strong class="text-chalk">{data.invitedBy}</strong> has invited you to collaborate.
			{:else}
				You've been invited to collaborate.
			{/if}
			Sign in with Google using the email address that received the invitation and the shared
			workspace will be waiting for you.
		</div>
	{/if}
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Sign in</h1>
		<p class="text-chalk/70">New here? Signing in with Google creates your account.</p>
	</div>
	<GoogleSignInButton />
</div>
