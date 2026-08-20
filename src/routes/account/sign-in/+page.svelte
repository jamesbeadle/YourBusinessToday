<script lang="ts">
	import GoogleSignInButton from '$lib/components/account/GoogleSignInButton.svelte';
</script>

<svelte:head>
	<title>Sign in — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Sign in</h1>
		<p class="text-chalk/70">New here? Signing in with Google creates your account.</p>
	</div>
	<GoogleSignInButton />
</div>
