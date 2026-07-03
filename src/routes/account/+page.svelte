<script lang="ts">
	import { enhance } from '$app/forms';
	import PurchaseHistoryTable from '$lib/components/account/PurchaseHistoryTable.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Account — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-1">
			<h1 class="font-display text-3xl font-medium">Account</h1>
			<p class="text-chalk/70">{data.userEmail}</p>
		</div>
		<form method="POST" action="?/signOut" use:enhance>
			<button
				type="submit"
				class="rounded-full border border-hairline px-6 py-2.5 font-display text-sm text-chalk/80
					transition hover:border-signal hover:text-signal"
			>
				Sign out
			</button>
		</form>
	</div>
	<div class="flex items-center justify-between rounded-2xl border border-hairline bg-carriage p-6">
		<div>
			<p class="font-display text-sm tracking-widest text-chalk/50 uppercase">Credit balance</p>
			<p class="font-display text-4xl font-medium">{data.creditBalance}</p>
		</div>
		<a
			href="/account/credits"
			class="rounded-full bg-go px-6 py-3 font-display text-sm font-medium text-night transition
				hover:brightness-110"
		>
			Top up
		</a>
	</div>
	<PurchaseHistoryTable purchases={data.purchases} />
</div>
