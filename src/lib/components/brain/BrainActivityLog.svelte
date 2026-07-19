<script lang="ts">
	import type { BrainEvent } from '$lib/data/brainTypes';

	let { events }: { events: BrainEvent[] } = $props();

	function describe(event: BrainEvent): string {
		if (event.kind === 'source_ingested') return String(event.detail.logLine ?? 'Source read');
		if (event.kind === 'page_created') return `Created ${event.pageSlug}`;
		if (event.kind === 'page_updated') return `Updated ${event.pageSlug}`;
		return `Answered: ${String(event.detail.question ?? '')}`;
	}

	function dayOf(event: BrainEvent): string {
		return new Date(event.createdAt).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short'
		});
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div>
		<h2 class="font-display text-xl font-medium">The log</h2>
		<p class="text-sm text-chalk/60">Everything the librarian has done, newest first.</p>
	</div>
	{#if events.length === 0}
		<p class="text-sm text-chalk/50">Nothing yet.</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each events as event (event.id)}
				<li class="flex items-baseline gap-3 text-sm">
					<span class="shrink-0 font-display text-xs text-chalk/40">{dayOf(event)}</span>
					{#if event.pageSlug !== null}
						<a href={`/brain/${event.pageSlug}`} class="text-chalk/80 transition hover:text-chalk">
							{describe(event)}
						</a>
					{:else}
						<span class="text-chalk/80">{describe(event)}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</section>
