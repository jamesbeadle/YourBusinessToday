<script lang="ts">
	import KnowledgeKindCard from './KnowledgeKindCard.svelte';
	import { findKnowledgeKind } from '$lib/data/knowledge/knowledgeKinds';

	const kindCards = [
		{
			kind: findKnowledgeKind('expertise'),
			example:
				'A builder’s playbook: what a variation order is, what sign-off requires, the language of the site.',
			href: '/knowledge',
			callToAction: 'Build your expertise'
		},
		{
			kind: findKnowledgeKind('experience'),
			example:
				'A project’s story: the variation order raised on the 12th, the inspection that followed, the decision that closed it.',
			href: '/knowledge',
			callToAction: 'Record your experience'
		},
		{
			kind: findKnowledgeKind('process'),
			example:
				'How a variation order travels — from site, to office, to client — drawn live as a transit map.',
			href: '/workspace',
			callToAction: 'Map your process'
		}
	];
</script>

<section class="border-y border-hairline bg-carriage/60">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<div class="flex flex-col gap-2">
			<h2 class="font-display text-3xl font-medium">Three kinds of knowledge</h2>
			<p class="max-w-prose text-chalk/70">
				Your expertise sets the rules of your trade. Your experience is the record of every job
				done within them. Your process is how the work moves. Together they are the whole
				picture of your business — and one conversation builds all three.
			</p>
		</div>
		<div class="mt-10 grid gap-6 md:grid-cols-3">
			{#each kindCards as kindCard (kindCard.kind.kind)}
				<KnowledgeKindCard {...kindCard} />
			{/each}
		</div>
	</div>
</section>
