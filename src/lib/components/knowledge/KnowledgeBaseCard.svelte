<script lang="ts">
	import BrainGlyph from './BrainGlyph.svelte';
	import type { KnowledgeBaseSummary } from '$lib/data/knowledge/knowledgeTypes';

	let { knowledgeBase }: { knowledgeBase: KnowledgeBaseSummary } = $props();

	const updatedOn = $derived(new Date(knowledgeBase.updatedAt).toLocaleDateString());

	function countLabel(count: number, singular: string, plural: string): string {
		return `${count} ${count === 1 ? singular : plural}`;
	}
</script>

<li>
	<a
		href={`/knowledge/${knowledgeBase.id}`}
		class="flex gap-4 rounded-2xl border border-hairline bg-carriage p-5 transition
			hover:border-signal/60 {knowledgeBase.isArchived ? 'opacity-60' : ''}"
	>
		<BrainGlyph seed={knowledgeBase.id} category="domain" size={64} />
		<div class="flex min-w-0 flex-col gap-1">
			<p class="truncate font-display text-lg font-medium">{knowledgeBase.name}</p>
			{#if knowledgeBase.description !== ''}
				<p class="line-clamp-2 text-sm text-chalk/60">{knowledgeBase.description}</p>
			{/if}
			<p class="mt-auto pt-1 text-xs text-chalk/50">
				{countLabel(knowledgeBase.domainBrainCount, 'domain brain', 'domain brains')} ·
				{countLabel(knowledgeBase.instanceBrainCount, 'instance brain', 'instance brains')} ·
				updated {updatedOn}
				{#if knowledgeBase.isArchived}· archived{/if}
			</p>
		</div>
	</a>
</li>
