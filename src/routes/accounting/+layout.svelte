<script lang="ts">
	import AccountingSubNavigation from '$lib/components/accounting/AccountingSubNavigation.svelte';

	let { children } = $props();
</script>

<AccountingSubNavigation />
{@render children()}
