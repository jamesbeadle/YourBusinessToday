<script lang="ts">
	import HarnessDiagram from '../harness/HarnessDiagram.svelte';
</script>

<section class="mx-auto max-w-6xl px-6 py-20 md:py-24">
	<p class="font-display text-sm tracking-widest text-signal uppercase">The harness</p>
	<h2 class="mt-5 max-w-3xl font-display text-3xl leading-tight font-medium md:text-5xl">
		One database that holds what your files hold, and everything runs around it.
	</h2>
	<div class="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
		<p class="text-lg text-chalk/70">
			Your business already creates its data. It just creates it in a spreadsheet here, a Word
			document there, an email thread and a folder of photographs. The harness is one place,
			almost always a SQL database, with a table for each thing you make and a column for each
			fact about it. Every value is checked at the door, so nothing goes in that does not fit.
		</p>
		<p class="text-lg text-chalk/70">
			The complex processes around it become skills. An AI agent, your own Claude or ChatGPT,
			reads the harness for its inputs, runs the process, and writes the result back into the
			harness, where the next process picks it up. The judgement stays with your people. The
			assembling, typing and chasing goes to the agent.
		</p>
	</div>
	<div class="mt-14">
		<HarnessDiagram />
	</div>
</section>
