<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import AttachmentRow from './AttachmentRow.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import { attachmentLimitDescription } from '$lib/data/taskAttachmentRules';
	import { uploadTaskAttachment } from './uploadTaskAttachment';
	import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

	let {
		attachments,
		projectId,
		taskId
	}: {
		attachments: (TaskAttachment & { uploaderName: string })[];
		projectId: string;
		taskId: string;
	} = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let uploadingLabel = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);

	async function uploadChosenFiles(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		input.value = '';
		errorMessage = null;
		for (const [index, file] of files.entries()) {
			uploadingLabel = progressLabel(index, files.length, file.name);
			const outcome = await uploadTaskAttachment(file);
			if (outcome.status === 'failed') {
				errorMessage = `${file.name}: ${outcome.message}`;
				break;
			}
		}
		uploadingLabel = null;
		await invalidateAll();
	}

	function progressLabel(index: number, fileCount: number, filename: string): string {
		if (fileCount === 1) return `Uploading ${filename}…`;
		return `Uploading ${index + 1} of ${fileCount} — ${filename}…`;
	}
</script>

<section class="flex flex-col gap-3">
	<div class="flex items-center justify-between gap-4">
		<h2 class="font-display text-xl font-medium">Attachments</h2>
		<input bind:this={fileInput} type="file" multiple onchange={uploadChosenFiles} class="hidden" />
		<button
			type="button"
			disabled={uploadingLabel !== null}
			onclick={() => fileInput?.click()}
			class="max-w-xs truncate rounded-full border border-hairline px-4 py-1.5 font-display text-sm
				text-chalk/70 transition hover:border-go hover:text-go disabled:opacity-60"
		>
			{uploadingLabel ?? 'Add file'}
		</button>
	</div>
	{#if attachments.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-6 text-chalk/60">
			No attachments yet — add a spec, a screenshot, or an export. {attachmentLimitDescription()}
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each attachments as attachment (attachment.id)}
				<AttachmentRow {attachment} {projectId} {taskId} />
			{/each}
		</ul>
	{/if}
	<FormErrorNote message={errorMessage} />
</section>
