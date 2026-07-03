<script lang="ts">
	import '../app.css';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';

	let { children, data } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<SiteHeader userEmail={data.userEmail} creditBalance={data.creditBalance} isAdmin={data.isAdmin} />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
