<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { BrainTypeDefinition, KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';

	let {
		definition,
		domainBrains,
		templateName = null
	}: {
		definition: BrainTypeDefinition;
		domainBrains: KbBrainSummary[];
		templateName?: string | null;
	} = $props();

	const tracker = new FormTracker();
	const canBindDomains = $derived(definition.category === 'instance' && domainBrains.length > 0);
	const descriptionLabel = $derived(
		definition.type === 'ddd_model' ? 'Domain goal' : 'Description'
	);
</script>

<form
	method="POST"
	action="?/createBrain"
	use:enhance={tracker.submit()}
	class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-5"
>
	<input type="hidden" name="brainType" value={definition.type} />
	<h2 class="font-display text-lg font-medium">New {templateName ?? definition.label} brain</h2>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Name</span>
		<input
			name="name"
			required
			class="rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
				focus:border-signal"
		/>
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">
			{descriptionLabel}
		</span>
		<textarea
			name="description"
			rows="2"
			class="rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
				focus:border-signal"
		></textarea>
	</label>
	{#if canBindDomains}
		<fieldset class="flex flex-col gap-2">
			<legend class="font-display text-sm tracking-widest text-chalk/50 uppercase">
				Guided by which expertise brains?
			</legend>
			{#each domainBrains as domainBrain (domainBrain.id)}
				<label class="flex items-center gap-2 text-sm text-chalk/80">
					<input
						type="checkbox"
						name="boundDomainBrainIds"
						value={domainBrain.id}
						class="accent-signal"
					/>
					{domainBrain.name}
				</label>
			{/each}
		</fieldset>
	{/if}
	<FormErrorNote message={tracker.errorMessage} />
	<SubmitButton
		isSaving={tracker.isSaving}
		savingLabel="Creating…"
		class="self-end rounded-full bg-signal px-6 py-2.5 font-display text-sm font-medium
			text-night transition hover:brightness-110"
	>
		Create brain
	</SubmitButton>
</form>
