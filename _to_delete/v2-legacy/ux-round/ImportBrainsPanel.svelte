<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { UnfiledDomainBrain } from '$lib/server/knowledge/getUnfiledDomainBrains';
	import type { KnowledgeBaseSummary } from '$lib/data/knowledge/knowledgeTypes';

	let {
		unfiledBrains,
		knowledgeBases
	}: { unfiledBrains: UnfiledDomainBrain[]; knowledgeBases: KnowledgeBaseSummary[] } = $props();

	const tracker = new FormTracker();
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-5">
	<h2 class="font-display text-xs tracking-widest text-chalk/50 uppercase">
		Your existing workspace brains
	</h2>
	<p class="text-sm text-chalk/60">
		These brains live in your workspace but aren't filed in a knowledge base yet. File one and it
		appears as a Trade Playbook — an expertise brain.
	</p>
	<ul class="flex flex-col divide-y divide-hairline">
		{#each unfiledBrains as brain (brain.id)}
			<li class="flex flex-wrap items-center gap-3 py-3">
				<div class="flex min-w-0 flex-1 flex-col">
					<span class="truncate font-display text-base">{brain.name}</span>
					<span class="text-xs text-chalk/50">{brain.entityName}</span>
				</div>
				<form
					method="POST"
					action="?/fileDomainBrain"
					use:enhance={tracker.submit()}
					class="flex items-center gap-2"
				>
					<input type="hidden" name="domainBrainId" value={brain.id} />
					<input type="hidden" name="brainName" value={brain.name} />
					<select
						name="knowledgeBaseId"
						required
						class="rounded-xl border border-hairline bg-night px-3 py-1.5 text-sm text-chalk"
					>
						{#each knowledgeBases as knowledgeBase (knowledgeBase.id)}
							<option value={knowledgeBase.id}>{knowledgeBase.name}</option>
						{/each}
					</select>
					<SubmitButton
						isSaving={tracker.isSaving}
						savingLabel="Filing…"
						class="rounded-full border border-hairline px-4 py-1.5 text-sm text-chalk/80
							transition hover:border-signal hover:text-signal"
					>
						File it
					</SubmitButton>
				</form>
			</li>
		{/each}
	</ul>
</section>
