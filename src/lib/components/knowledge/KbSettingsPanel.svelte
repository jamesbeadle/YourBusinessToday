<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { KnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';

	let { knowledgeBase }: { knowledgeBase: KnowledgeBase } = $props();

	const tracker = new FormTracker();
</script>

<div class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
	<section class="flex flex-col gap-1">
		<h3 class="font-display text-sm text-chalk">{knowledgeBase.name}</h3>
		{#if knowledgeBase.description !== ''}
			<p class="text-xs leading-relaxed text-chalk/60">{knowledgeBase.description}</p>
		{/if}
	</section>
	<section class="flex flex-col gap-2 border-t border-hairline pt-5">
		<h3 class="font-display text-sm text-chalk">
			{knowledgeBase.isArchived ? 'Archived' : 'Archive'}
		</h3>
		<p class="text-xs leading-relaxed text-chalk/60">
			{knowledgeBase.isArchived
				? 'This knowledge base is archived — it stays readable but fades in the register.'
				: 'Archiving keeps everything but moves this knowledge base out of the way.'}
		</p>
		<form method="POST" action="?/setArchived" use:enhance={tracker.submit()}>
			<input type="hidden" name="isArchived" value={String(!knowledgeBase.isArchived)} />
			<SubmitButton
				isSaving={tracker.isSaving}
				savingLabel="Saving…"
				class="rounded-full border border-hairline px-4 py-2 font-display text-sm text-chalk/80
					transition hover:border-signal hover:text-signal"
			>
				{knowledgeBase.isArchived ? 'Unarchive' : 'Archive'}
			</SubmitButton>
		</form>
	</section>
</div>
