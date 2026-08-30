<script lang="ts">
	import SecondBrainMark from './SecondBrainMark.svelte';
</script>

<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
	<div class="flex flex-col gap-6">
		<p class="font-display text-sm tracking-widest text-signal uppercase">
			Welcome to Your Business Today
		</p>
		<h1 class="font-display text-4xl leading-tight font-medium md:text-6xl">
			Your business,<br />with a second brain.
		</h1>
		<p class="max-w-prose text-lg text-chalk/70">
			YBT builds a second brain for your business and keeps it current. It knows the rules of
			your trade, remembers every job you've done, and understands how your work flows — so
			every answer it gives is grounded in your business, not the internet's.
		</p>
		<div class="flex flex-wrap items-center gap-4">
			<a
				href="/account/sign-in"
				class="rounded-full bg-signal px-7 py-3 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Build yours
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
		<SecondBrainMark />
	</div>
</section>
