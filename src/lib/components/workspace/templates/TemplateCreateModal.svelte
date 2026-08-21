<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import TemplateBriefing from './TemplateBriefing.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { brainTemplateAccentColor, type BrainTemplate } from '$lib/data/brainTemplates';

	let {
		entityId,
		template,
		isOpen = $bindable()
	}: {
		entityId: string;
		template: BrainTemplate;
		isOpen: boolean;
	} = $props();

	const tracker = new FormTracker();

	$effect(() => {
		if (!isOpen) tracker.reset();
	});
</script>

<Modal title={`${template.icon}  ${template.title}`} bind:isOpen maxWidthClass="max-w-2xl">
	{#key template.slug}
		<div class="flex flex-col gap-5" style={`--accent: ${brainTemplateAccentColor(template)}`}>
			<p class="-mt-3 text-sm text-chalk/60">{template.tagline}</p>
			<TemplateBriefing {template} />
			<FormErrorNote message={tracker.errorMessage} />
			<form
				method="POST"
				action={`/workspace/${entityId}?/createDomainBrain`}
				use:enhance={tracker.submit()}
				class="flex flex-col gap-4"
			>
				<label class="flex flex-col gap-1.5">
					<span class="font-display text-xs tracking-widest text-chalk/50 uppercase">Name</span>
					<input
						name="name"
						required
						placeholder={template.namePlaceholder}
						class="rounded-full border border-hairline bg-night px-4 py-2.5 text-sm text-chalk
							outline-none placeholder:text-chalk/40 focus:border-signal"
					/>
				</label>
				<label class="flex flex-col gap-1.5">
					<span class="font-display text-xs tracking-widest text-chalk/50 uppercase">
						Domain goal
					</span>
					<span class="text-xs text-chalk/50">
						This tunes the brain — it measures everything the brain learns. Tweak it if you like.
					</span>
					<textarea
						name="domainGoal"
						required
						rows="6"
						value={template.domainGoal}
						placeholder="What should this brain articulate?"
						class="resize-none rounded-2xl border border-hairline bg-night px-4 py-2.5 text-sm
							leading-relaxed text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
					></textarea>
				</label>
				<SubmitButton
					isSaving={tracker.isSaving}
					savingLabel="Creating…"
					class="self-end rounded-full bg-signal px-6 py-2.5 font-display text-sm font-medium
						text-night transition hover:brightness-110"
				>
					Create brain
				</SubmitButton>
			</form>
		</div>
	{/key}
</Modal>
