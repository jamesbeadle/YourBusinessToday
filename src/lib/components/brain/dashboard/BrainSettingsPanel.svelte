<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import FileIntoKnowledgeBasePanel from './FileIntoKnowledgeBasePanel.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
	import type { KnowledgeBaseSummary } from '$lib/data/knowledge/knowledgeTypes';

	let {
		brain,
		knowledgeBases,
		filedKnowledgeBaseName
	}: {
		brain: DomainBrain;
		knowledgeBases: KnowledgeBaseSummary[];
		filedKnowledgeBaseName: string | null;
	} = $props();

	const tracker = new FormTracker();
	let isDeleteModalOpen = $state(false);
</script>

<div class="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-4">
	<section class="flex flex-col gap-2">
		<h3 class="font-display text-sm text-chalk">Domain goal</h3>
		<p class="text-xs leading-relaxed text-chalk/60">
			What this brain should articulate. The Modeller measures every page against it, so a
			sharper goal changes how every future document is distilled.
		</p>
		<FormErrorNote message={tracker.errorMessage} />
		<form
			method="POST"
			action="?/updateDomainGoal"
			use:enhance={tracker.submit()}
			class="flex flex-col gap-2"
		>
			<textarea
				name="domainGoal"
				required
				rows="5"
				placeholder="e.g. “The abstract domain of organized football — the concepts any football app would need, whatever club or league the documents describe.”"
				aria-label="Domain goal"
				class="min-w-0 resize-none rounded-2xl border border-hairline bg-carriage px-4 py-2.5
					text-sm text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
				>{brain.domainGoal}</textarea
			>
			<SubmitButton
				isSaving={tracker.isSaving}
				savingLabel="Saving…"
				class="self-end rounded-full bg-signal px-5 py-2 font-display text-sm font-medium
					text-night transition hover:brightness-110"
			>
				Save goal
			</SubmitButton>
		</form>
	</section>
	<FileIntoKnowledgeBasePanel {knowledgeBases} {filedKnowledgeBaseName} />
	<section class="flex flex-col gap-2 border-t border-hairline pt-6">
		<h3 class="font-display text-sm text-signal">Delete this expertise brain</h3>
		<p class="text-xs leading-relaxed text-chalk/60">
			Everything it has learned goes with it — every page, bounded context, source document,
			conversation, and log entry. Starting again means feeding it documents from scratch.
		</p>
		<button
			type="button"
			onclick={() => (isDeleteModalOpen = true)}
			class="self-start rounded-full border border-signal/60 px-4 py-2 font-display text-sm
				text-signal transition hover:bg-signal hover:text-night"
		>
			Delete expertise brain
		</button>
	</section>
</div>

<DangerConfirmModal
	title="Delete this expertise brain?"
	description={`${brain.name} and everything it has learned — every page, context, source
		document, and conversation — is deleted with it. This cannot be undone.`}
	action="?/deleteDomainBrain"
	fields={{}}
	submitLabel="Delete expertise brain"
	confirmWord="DELETE"
	bind:isOpen={isDeleteModalOpen}
/>
