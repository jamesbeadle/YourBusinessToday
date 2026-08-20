<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { WorkspaceShare } from '$lib/data/sharingTypes';

	let { shares }: { shares: WorkspaceShare[] } = $props();

	async function unshare(shareId: string) {
		await fetch('/api/workspace/shares', {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ shareId })
		});
		await invalidateAll();
	}
</script>

<ul class="flex flex-col">
	{#each shares as candidate (candidate.id)}
		<li class="flex items-center justify-between gap-3 border-b border-hairline py-2.5 last:border-b-0">
			<div class="min-w-0">
				<p class="truncate text-sm text-chalk">{candidate.collaboratorEmail}</p>
				<p class="font-display text-[10px] tracking-widest text-chalk/40 uppercase">
					{candidate.scope === 'entity' ? 'Whole entity' : 'This brain'}
				</p>
			</div>
			<button
				type="button"
				onclick={() => unshare(candidate.id)}
				aria-label={`Stop sharing with ${candidate.collaboratorEmail}`}
				class="rounded-full px-1.5 text-chalk/40 transition hover:bg-hairline/40 hover:text-signal"
			>
				✕
			</button>
		</li>
	{/each}
</ul>
