<script lang="ts">
	import BrandWordmark from '../site/BrandWordmark.svelte';
</script>

<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
	<div class="flex flex-col gap-6">
		<p class="font-display text-sm tracking-widest text-signal uppercase">
			Welcome to Your Business Today
		</p>
		<h1 class="font-display text-4xl leading-tight font-medium md:text-6xl">
			We come in and<br />automate your business.
		</h1>
		<p class="max-w-prose text-lg text-chalk/70">
			We find the spreadsheets, documents and emails your business is really run from, put what
			they hold into one database we call the harness, and teach an AI agent the processes that
			run around it. You see it all on dashboards, and your own Claude or ChatGPT works it through
			an MCP server with the same permissions as the screens. What we build stays yours.
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
				How the process works
			</a>
		</div>
	</div>
	<div class="hidden items-center justify-center md:flex" aria-hidden="true">
		<BrandWordmark fontSize={150} />
	</div>
</section>
