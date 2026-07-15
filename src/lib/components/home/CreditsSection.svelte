<script lang="ts">
	import { creditsPerReply, welcomeCreditCount } from '$lib/data/creditPricing';
</script>

<section class="mx-auto max-w-6xl px-6 py-16">
	<div class="grid items-center gap-10 md:grid-cols-2">
		<div class="flex flex-col gap-4">
			<h2 class="font-display text-3xl font-medium">Pay as you go</h2>
			<p class="max-w-prose text-chalk/70">
				No subscriptions. Buy credits once and spend them across any tool in the ecosystem —
				today that's conversations with the mapping agent; tomorrow it's transition plans,
				agents on shift, and new clients in your pipeline.
			</p>
			<p class="max-w-prose text-chalk/70">
				Top up whenever you're running low. Everything you've built — your profile, your map —
				stays yours either way.
			</p>
			<a
				href="/account/credits"
				class="self-start rounded-full border border-go/60 px-6 py-2.5 font-display text-sm
					text-go transition hover:bg-go hover:text-night"
			>
				View credit packs
			</a>
		</div>
		<div class="rounded-2xl border border-hairline bg-carriage p-8">
			<p class="font-display text-sm tracking-widest text-chalk/50 uppercase">Fares</p>
			<dl class="mt-4 flex flex-col gap-3">
				<div class="flex items-baseline justify-between gap-4">
					<dt class="text-chalk/80">Agent replies</dt>
					<dd class="font-display">{creditsPerReply} credits each</dd>
				</div>
				<div class="flex items-baseline justify-between gap-4">
					<dt class="text-chalk/80">Live Workflow Map updates</dt>
					<dd class="font-display text-go">Included</dd>
				</div>
				<div class="flex items-baseline justify-between gap-4">
					<dt class="text-chalk/80">Welcome credits on sign-up</dt>
					<dd class="font-display text-go">{welcomeCreditCount} free</dd>
				</div>
			</dl>
		</div>
	</div>
</section>
