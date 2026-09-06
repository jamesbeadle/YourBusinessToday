<script lang="ts">
	import type { FoundLink } from '$lib/server/people/research/personFindings';

	let { links }: { links: FoundLink[] } = $props();
</script>

<div class="flex flex-col gap-1 text-sm text-chalk/70">
	<p>Links to keep</p>
	{#if links.length === 0}
		<p class="text-xs text-chalk/40">No pages worth linking were found.</p>
	{/if}
	{#each links as link, index (link.url)}
		<label class="flex items-center gap-2">
			<input type="checkbox" name="linkKept" value={index} checked class="accent-go" />
			<input type="hidden" name="linkLabel" value={link.label} />
			<input type="hidden" name="linkUrl" value={link.url} />
			<span class="text-chalk/80">{link.label}</span>
			<a href={link.url} target="_blank" rel="noreferrer" class="truncate text-xs text-chalk/40 hover:text-signal">
				{link.url}
			</a>
		</label>
	{/each}
</div>
