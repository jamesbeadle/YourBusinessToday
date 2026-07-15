<script lang="ts">
	import BrandWordmark from '../site/BrandWordmark.svelte';
</script>

<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
	<div class="flex flex-col gap-6">
		<p class="font-display text-sm tracking-widest text-signal uppercase">
			Welcome to Your Business Today
		</p>
		<h1 class="font-display text-4xl leading-tight font-medium md:text-6xl">
			AI tools that actually<br />know your business.
		</h1>
		<p class="max-w-prose text-lg text-chalk/70">
			Tell YBT about your business once, and every tool in the ecosystem works from that
			understanding — the Workflow Map shows how you run today, the Autopilot plans the
			handover to AI, the Workforce puts your agents on shift, and the Prospector keeps
			new clients coming.
		</p>
		<div class="flex flex-wrap items-center gap-4">
			<a
				href="/account/sign-in"
				class="rounded-full bg-signal px-7 py-3 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Start free — 300 credits included
			</a>
			<a
				href="/vision"
				class="rounded-full border border-hairline px-7 py-3 font-display text-sm text-chalk/80
					transition hover:border-chalk/40 hover:text-chalk"
			>
				Read what we're building
			</a>
		</div>
	</div>
	<div class="hidden items-center justify-center md:flex" aria-hidden="true">
		<BrandWordmark fontSize={150} />
	</div>
</section>
