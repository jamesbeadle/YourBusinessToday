<script lang="ts">
	import BrandMark from './BrandMark.svelte';
	import CreditBalancePill from './CreditBalancePill.svelte';

	let {
		userEmail,
		creditBalance,
		isAdmin
	}: { userEmail: string | null; creditBalance: number | null; isAdmin: boolean } = $props();

	const isSignedIn = $derived(userEmail !== null);

	const navigationLinks = $derived([
		{ href: '/', label: 'Home' },
		{ href: '/project', label: 'Demo map' },
		{ href: '/workspace', label: 'Workspace' },
		...(isSignedIn ? [{ href: '/shared', label: 'Shared with me' }] : []),
		...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
	]);
</script>

<header class="border-b border-hairline bg-night/95 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
		<a href="/" class="flex items-center gap-3">
			<BrandMark />
			<span class="font-display text-lg font-medium tracking-tight">Your Business Today</span>
		</a>
		<nav class="flex flex-wrap items-center gap-x-6 gap-y-2">
			{#each navigationLinks as navigationLink}
				<a
					href={navigationLink.href}
					class="font-display text-sm text-chalk/80 transition hover:text-chalk"
				>
					{navigationLink.label}
				</a>
			{/each}
			{#if isSignedIn}
				<CreditBalancePill balance={creditBalance ?? 0} />
				<a href="/account" class="font-display text-sm text-chalk/80 transition hover:text-chalk">
					Account
				</a>
			{:else}
				<a
					href="/account/sign-in"
					class="rounded-full bg-signal px-5 py-2 font-display text-sm font-medium text-night
						transition hover:brightness-110"
				>
					Sign in
				</a>
			{/if}
		</nav>
	</div>
</header>
