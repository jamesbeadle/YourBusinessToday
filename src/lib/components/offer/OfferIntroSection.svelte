<script lang="ts">
	import { offerDocumentPath } from '$lib/data/consultancyOffer';
</script>

<section class="mx-auto max-w-6xl px-6 py-20 md:py-24">
	<p class="font-display text-sm tracking-widest text-signal uppercase">The offer</p>
	<h1 class="mt-5 max-w-3xl font-display text-4xl leading-tight font-medium md:text-5xl">
		Five steps, and you can stop after any of them.
	</h1>
	<div class="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
		<p class="text-lg text-chalk/70">
			This is for a business that already works. You have customers, a reputation and people
			who know their trade. What you do not have is one place where the business is: the quote
			is in a spreadsheet, the job is in an email, the report is typed from photographs, and
			two or three people carry the rest in their heads.
		</p>
		<p class="text-lg text-chalk/70">
			We come in, find every file that creates something, build the harness that holds it, and
			teach an AI agent the processes that run around it. You reach it all through dashboards
			and through an MCP server that your own Claude or ChatGPT uses with the same permissions.
			Each step is agreed before it starts, and you own what each one leaves behind.
		</p>
	</div>
	<a
		href={offerDocumentPath}
		download
		class="mt-10 inline-block rounded-full border border-hairline px-6 py-2.5 font-display text-sm
			text-chalk/80 transition hover:border-chalk/40 hover:text-chalk"
	>
		Download the offer as a PDF
	</a>
</section>
