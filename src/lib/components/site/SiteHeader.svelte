<script lang="ts">
	import AccountMenu from './AccountMenu.svelte';
	import BrandWordmark from './BrandWordmark.svelte';
	import CreditBalancePill from './CreditBalancePill.svelte';
	import MobileMenuButton from './MobileMenuButton.svelte';
	import MobileNavDrawer from './MobileNavDrawer.svelte';
	import NotificationsBell from './NotificationsBell.svelte';
	import { buildMenuGroups } from './siteNavigation';

	let {
		userEmail,
		creditBalance,
		isAdmin,
		isStaff,
		unreadNotificationCount
	}: {
		userEmail: string | null;
		creditBalance: number | null;
		isAdmin: boolean;
		isStaff: boolean;
		unreadNotificationCount: number;
	} = $props();

	const isSignedIn = $derived(userEmail !== null);
	const isProjectManager = $derived(isStaff || isAdmin);
	const menuGroups = $derived(buildMenuGroups({ isSignedIn, isProjectManager, isAdmin }));

	let isMobileMenuOpen = $state(false);

	const openMobileMenu = () => (isMobileMenuOpen = true);
	const closeMobileMenu = () => (isMobileMenuOpen = false);
</script>

<header class="relative z-40 border-b border-hairline bg-night">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
		<a href="/" class="flex items-center">
			<BrandWordmark fontSize={26} />
		</a>
		<nav class="hidden items-center gap-6 md:flex">
			{#if isProjectManager}
				<NotificationsBell unreadCount={unreadNotificationCount} />
			{/if}
			{#if isSignedIn}
				<CreditBalancePill balance={creditBalance ?? 0} />
			{:else}
				<a
					href="/account/sign-in"
					class="rounded-full bg-signal px-5 py-2 font-display text-sm font-medium text-night
						transition hover:brightness-110"
				>
					Sign in
				</a>
			{/if}
			<AccountMenu {menuGroups} />
		</nav>
		<div class="flex items-center gap-4 md:hidden">
			{#if isProjectManager}
				<NotificationsBell unreadCount={unreadNotificationCount} />
			{/if}
			<MobileMenuButton onOpen={openMobileMenu} />
		</div>
	</div>
</header>

{#if isMobileMenuOpen}
	<MobileNavDrawer {menuGroups} {isSignedIn} creditBalance={creditBalance ?? 0} onClose={closeMobileMenu} />
{/if}
