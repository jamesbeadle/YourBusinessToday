<script lang="ts">
	import DisciplineRow from './DisciplineRow.svelte';
	import { consultancyDisciplines } from '$lib/data/consultancyDisciplines';
</script>

<section class="mx-auto max-w-6xl px-6 py-20 md:py-24">
	<p class="font-display text-sm tracking-widest text-signal uppercase">What we do</p>
	<h2 class="mt-5 max-w-3xl font-display text-3xl leading-tight font-medium md:text-5xl">
		Most consultancies leave a report. We leave a business that runs itself.
	</h2>
	<div class="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
		<p class="text-lg text-chalk/70">
			We are brought in when a business has outgrown the way it has always been run: when the
			quote lives in one spreadsheet and the invoice in another, when the report is typed out
			from photographs every Friday, and when the few people holding it together can never
			take a week off.
		</p>
		<p class="text-lg text-chalk/70">
			We start by finding every file that creates something in your business. Then we build the
			harness that holds what those files hold, teach an AI agent the processes that run around
			it, and give you two doors on to it: dashboards for the screen, and an MCP server for the
			agent. Each piece goes live and starts earning before the next is built.
		</p>
	</div>
	<div class="mt-14 border-t border-hairline md:mt-16">
		{#each consultancyDisciplines as discipline (discipline.id)}
			<DisciplineRow {discipline} />
		{/each}
	</div>
	<a
		href="/offer"
		class="mt-10 inline-block rounded-full border border-hairline px-6 py-2.5 font-display text-sm
			text-chalk/80 transition hover:border-chalk/40 hover:text-chalk"
	>
		How an engagement works
	</a>
</section>
