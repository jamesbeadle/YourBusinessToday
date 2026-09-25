<script lang="ts">
	import BrandWordmark from '../site/BrandWordmark.svelte';
</script>

<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
	<div class="flex flex-col gap-6">
		<p class="font-display text-sm tracking-widest text-signal uppercase">
			Welcome to Your Business Today
		</p>
		<h1 class="font-display text-4xl leading-tight font-medium md:text-6xl">
			Put AI to work<br />in your business.
		</h1>
		<p class="max-w-prose text-lg text-chalk/70">
			We are a consultancy that automates businesses with AI. We map where your data comes from,
			build the harness that holds it, and equip an AI agent with the skills to run the processes
			around it. Your people see it on dashboards. Their AI assistant works it through an MCP
			server. Everything we build is yours.
		</p>
		<div class="flex flex-wrap items-center gap-4">
			<a
				href="/contact"
				class="rounded-full bg-signal px-7 py-3 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Talk to us
			</a>
			<a
				href="/offer"
				class="rounded-full border border-hairline px-7 py-3 font-display text-sm text-chalk/80
					transition hover:border-chalk/40 hover:text-chalk"
			>
				See how it works
			</a>
		</div>
	</div>
	<div class="hidden items-center justify-center md:flex" aria-hidden="true">
		<BrandWordmark fontSize={150} />
	</div>
</section>
