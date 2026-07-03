<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPenceAsPounds } from '$lib/data/creditPricing';
	import type { CreditPack } from '$lib/server/credits/getCreditPacks';

	let { creditPack, isMostPopular }: { creditPack: CreditPack; isMostPopular: boolean } = $props();
</script>

<article
	class={`relative flex flex-col gap-4 rounded-2xl border bg-carriage p-6
		${isMostPopular ? 'border-go' : 'border-hairline'}`}
>
	{#if isMostPopular}
		<p
			class="absolute -top-3 right-5 rounded-full bg-go px-3 py-0.5 font-display text-xs
				font-medium text-night"
		>
			Most popular
		</p>
	{/if}
	<h2 class="font-display text-xl font-medium">{creditPack.name}</h2>
	<p class="font-display text-4xl font-medium">
		{creditPack.credits}
		<span class="text-base font-normal text-chalk/60">credits</span>
	</p>
	<p class="text-chalk/70">{formatPenceAsPounds(creditPack.pricePence)}</p>
	<form method="POST" action="?/buy" use:enhance class="mt-auto">
		<input type="hidden" name="packId" value={creditPack.id} />
		<button
			type="submit"
			class="w-full rounded-full bg-signal px-6 py-3 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Buy with Stripe (test)
		</button>
	</form>
</article>
