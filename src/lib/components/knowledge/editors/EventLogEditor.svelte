<script lang="ts">
	import ItemComposer from './ItemComposer.svelte';
	import ItemRow from './ItemRow.svelte';
	import { bodyField, dataField, dataFrom, titleField } from './editorFields';
	import type { KbBrainItem } from '$lib/data/knowledge/knowledgeTypes';

	let { items }: { items: KbBrainItem[] } = $props();

	const episodes = $derived(
		items
			.filter((item) => item.itemKind === 'episode')
			.toSorted((first, second) => momentOf(second).localeCompare(momentOf(first)))
	);

	function momentOf(episode: KbBrainItem): string {
		return episode.occurredAt ?? episode.createdAt;
	}

	function episodeDetail(episode: KbBrainItem): string {
		const moment = new Date(momentOf(episode)).toLocaleString();
		const provenance = dataFrom(episode, 'provenance');
		return provenance === '' ? moment : `${moment} · from ${provenance}`;
	}
</script>

<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
	<section class="flex flex-col gap-3">
		<h3 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Timeline</h3>
		{#if episodes.length === 0}
			<p class="text-sm text-chalk/40">
				Nothing recorded yet — raw captures land here in order and are never rewritten.
			</p>
		{:else}
			<ul class="flex flex-col divide-y divide-hairline border-l-2 border-hairline pl-4">
				{#each episodes as episode (episode.id)}
					<ItemRow item={episode} detail={episodeDetail(episode)} />
				{/each}
			</ul>
		{/if}
	</section>
	<div class="flex flex-col gap-2">
		<h3 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Record</h3>
		<ItemComposer
			itemKind="episode"
			fields={[
				titleField('What happened', 'Site meeting, decision, observation…'),
				bodyField('Detail'),
				{ name: 'occurredAt', label: 'When', control: 'datetime' },
				dataField('provenance', 'Provenance', 'Who or what reported this?')
			]}
			submitLabel="Record it"
		/>
	</div>
</div>
