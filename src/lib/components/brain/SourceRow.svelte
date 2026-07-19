<script lang="ts">
	import { ingestSource } from './uploadSourceFile';
	import { invalidateAll } from '$app/navigation';
	import type { BrainSource } from '$lib/data/brainTypes';

	let {
		source,
		onOutOfCredits
	}: { source: BrainSource; onOutOfCredits: () => void } = $props();

	let isRetrying = $state(false);

	const statusStyles: Record<BrainSource['status'], string> = {
		uploaded: 'border-chalk/30 text-chalk/60',
		ingested: 'border-go/60 text-go',
		failed: 'border-signal/60 text-signal'
	};

	const statusLabels: Record<BrainSource['status'], string> = {
		uploaded: 'Waiting',
		ingested: 'In the brain',
		failed: 'Failed'
	};

	async function retryIngest() {
		isRetrying = true;
		const outcome = await ingestSource(source.id);
		isRetrying = false;
		if (outcome.status === 'out_of_credits') return onOutOfCredits();
		await invalidateAll();
	}
</script>

<li class="flex items-center justify-between gap-4 border-b border-hairline py-3 last:border-b-0">
	<div class="min-w-0">
		<p class="truncate text-sm text-chalk">{source.filename}</p>
		{#if source.summary !== ''}
			<p class="truncate text-xs text-chalk/50">{source.summary}</p>
		{/if}
	</div>
	<div class="flex shrink-0 items-center gap-3">
		{#if source.status === 'failed' || source.status === 'uploaded'}
			<button
				type="button"
				disabled={isRetrying}
				onclick={retryIngest}
				class="font-display text-xs text-chalk/70 underline transition hover:text-chalk
					disabled:opacity-40"
			>
				{isRetrying ? 'Reading…' : 'Read it'}
			</button>
		{/if}
		<span
			class={`rounded-full border px-3 py-1 font-display text-xs ${statusStyles[source.status]}`}
		>
			{statusLabels[source.status]}
		</span>
	</div>
</li>
