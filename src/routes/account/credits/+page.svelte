<script lang="ts">
	import CreditPackCard from '$lib/components/account/CreditPackCard.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Buy credits — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Buy credits</h1>
		<p class="max-w-prose text-chalk/70">
			Credits pay for conversations with the agent and Workflow Map redraws. Checkout runs in
			Stripe test mode for now — no card is charged.
		</p>
	</div>
	{#if form?.purchasedPackId}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">
			The {form.purchasedPackId} pack is yours — your balance is now {form.creditBalance} credits.
		</p>
	{/if}
	{#if form?.message}
		<p class="rounded-2xl border border-caution/50 bg-caution/10 px-5 py-4 text-caution">
			{form.message}
		</p>
	{/if}
	<div class="grid gap-6 md:grid-cols-3">
		{#each data.creditPacks as creditPack (creditPack.id)}
			<CreditPackCard {creditPack} isMostPopular={creditPack.id === 'growth'} />
		{/each}
	</div>
	<p class="text-sm text-chalk/50">
		Payments will move to live Stripe Checkout before launch. Every purchase lands in your credit
		ledger the moment it completes.
	</p>
</div>
