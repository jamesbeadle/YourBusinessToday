<script lang="ts">
	import CreditPackCard from '$lib/components/account/CreditPackCard.svelte';
	import SendCreditsPanel from '$lib/components/account/SendCreditsPanel.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Credits — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Credits</h1>
		<p class="max-w-prose text-chalk/70">
			Credits pay for the Domain Brain — ingesting documents and holding conversations grounded
			in your own records.
		</p>
	</div>
	{#if !data.isCheckoutLive}
		<p class="rounded-2xl border border-signal/40 bg-signal/10 px-5 py-4 text-chalk/80">
			Early access: credit packs can't be bought yet. The Your Business Today team grants
			credits directly to your account — get in touch and we'll top you up.
		</p>
	{/if}
	{#if data.checkoutState === 'success'}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">
			Payment received — your credits land in the ledger within a few seconds. Refresh if your
			balance hasn't moved yet.
		</p>
	{/if}
	{#if data.checkoutState === 'cancelled'}
		<p class="rounded-2xl border border-hairline bg-carriage px-5 py-4 text-chalk/70">
			Checkout cancelled — no card was charged.
		</p>
	{/if}
	{#if form?.message}
		<p class="rounded-2xl border border-caution/50 bg-caution/10 px-5 py-4 text-caution">
			{form.message}
		</p>
	{/if}
	<div class="grid gap-6 md:grid-cols-3">
		{#each data.creditPacks as creditPack (creditPack.id)}
			<CreditPackCard
				{creditPack}
				isMostPopular={creditPack.id === 'growth'}
				isCheckoutLive={data.isCheckoutLive}
			/>
		{/each}
	</div>
	<p class="text-sm text-chalk/50">
		{#if data.isCheckoutLive}
			You'll be taken to Stripe to pay. Every purchase lands in your credit ledger the moment it
			completes.
		{:else}
			Prices shown are what packs will cost once checkout opens.
		{/if}
	</p>
	<SendCreditsPanel />
</div>
