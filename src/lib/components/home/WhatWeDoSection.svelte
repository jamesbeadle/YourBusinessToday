<script lang="ts">
	import DisciplineRow from './DisciplineRow.svelte';
	import { consultancyDisciplines } from '$lib/data/consultancyDisciplines';
</script>

<section class="mx-auto max-w-6xl px-6 py-20 md:py-24">
	<p class="font-display text-sm tracking-widest text-signal uppercase">What we do</p>
	<h2 class="mt-5 max-w-3xl font-display text-3xl leading-tight font-medium md:text-5xl">
		Most consultancies leave a report. We leave a business that runs.
	</h2>
	<div class="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
		<p class="text-lg text-chalk/70">
			We are brought in when a business has outgrown the way it has always been run — when the
			office and the floor hand work to each other through memory and goodwill, when nobody can
			say what state a job is really at, and when the few people holding it together can never
			take a week off.
		</p>
		<p class="text-lg text-chalk/70">
			We start where any consultancy should, by understanding the business: we interview the
			people who do the work and read the documents you already have. Then, unlike most, we
			stay and do something about it. Some of what we change needs no software at all. The rest
			goes live a piece at a time, so the first part is earning before the second is built.
		</p>
	</div>
	<div class="mt-14 border-t border-hairline md:mt-16">
		{#each consultancyDisciplines as discipline (discipline.id)}
			<DisciplineRow {discipline} />
		{/each}
	</div>
</section>
