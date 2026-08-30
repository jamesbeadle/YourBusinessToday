<script lang="ts">
	import RegisterBrainRow from './RegisterBrainRow.svelte';
	import type { KnowledgeBaseRegisterGroup } from '$lib/server/knowledge/getSecondBrainRegister';

	let { groups }: { groups: KnowledgeBaseRegisterGroup[] } = $props();
</script>

<div class="flex flex-col gap-6">
	{#each groups as group (group.id)}
		<section
			class="flex flex-col overflow-hidden rounded-2xl border border-hairline
				{group.isArchived ? 'opacity-60' : ''}"
		>
			<a
				href={`/knowledge-base/${group.id}`}
				class="group flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline
					bg-carriage/60 px-4 py-3 transition hover:bg-carriage sm:px-5"
			>
				<span class="flex items-baseline gap-3">
					<span class="font-display text-lg font-medium transition group-hover:text-signal">
						{group.name}
					</span>
					{#if group.description !== ''}
						<span class="hidden text-sm text-chalk/50 sm:inline">{group.description}</span>
					{/if}
				</span>
				<span class="font-display text-xs text-chalk/50">
					{group.brains.length}
					{group.brains.length === 1 ? 'second brain' : 'second brains'} →
				</span>
			</a>
			{#if group.brains.length === 0}
				<p class="px-5 py-6 text-sm text-chalk/50">
					No second brains yet — open this knowledge base to add its first.
				</p>
			{:else}
				<ul class="flex flex-col divide-y divide-hairline">
					{#each group.brains as brain (brain.kind + brain.id)}
						<RegisterBrainRow {brain} />
					{/each}
				</ul>
			{/if}
		</section>
	{/each}
</div>
