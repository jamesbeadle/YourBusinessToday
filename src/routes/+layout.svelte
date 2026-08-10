<script lang="ts">
	import '../app.css';
	import NavigationProgressBar from '$lib/components/site/NavigationProgressBar.svelte';
	import SavingOverlay from '$lib/components/site/SavingOverlay.svelte';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';

	let { children, data } = $props();
</script>

<NavigationProgressBar />
<SavingOverlay />

<div class="flex min-h-screen flex-col">
	<SiteHeader
		userEmail={data.userEmail}
		creditBalance={data.creditBalance}
		isAdmin={data.isAdmin}
		isStaff={data.isStaff}
		unreadNotificationCount={data.unreadNotificationCount}
	/>
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
