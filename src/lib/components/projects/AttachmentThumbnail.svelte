<script lang="ts">
	import { attachmentHref } from './attachmentLinks';
	import { fileExtensionLabel, previewKindFor } from '$lib/data/taskAttachmentRules';
	import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

	let {
		attachment,
		projectId,
		taskId
	}: { attachment: TaskAttachment; projectId: string; taskId: string } = $props();

	const isImage = $derived(previewKindFor(attachment.mimeType) === 'image');
</script>

{#if isImage}
	<img
		src={attachmentHref(projectId, taskId, attachment.id, 'open')}
		alt=""
		loading="lazy"
		class="h-10 w-10 shrink-0 rounded-lg border border-hairline object-cover"
	/>
{:else}
	<span
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline
			bg-night font-display text-[10px] tracking-wider text-chalk/60 uppercase"
	>
		{fileExtensionLabel(attachment.filename)}
	</span>
{/if}
