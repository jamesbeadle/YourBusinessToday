<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import { attachmentHref } from './attachmentLinks';
	import { describeByteCount } from '$lib/data/taskAttachmentRules';
	import { formatBritishDate } from '$lib/data/britishDate';
	import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

	let {
		attachment,
		projectId,
		taskId
	}: {
		attachment: TaskAttachment & { uploaderName: string };
		projectId: string;
		taskId: string;
	} = $props();

	let isRemoveModalOpen = $state(false);
</script>

<li class="flex items-center justify-between gap-4 px-5 py-3">
	<div class="flex min-w-0 flex-col gap-0.5">
		<a
			href={attachmentHref(projectId, taskId, attachment.id, 'open')}
			target="_blank"
			rel="noreferrer"
			class="truncate font-display text-chalk transition hover:text-go"
		>
			{attachment.filename}
		</a>
		<p class="text-xs text-chalk/50">
			{describeByteCount(attachment.byteCount)}
			· <span class="text-chalk/80">{attachment.uploaderName}</span>
			· {formatBritishDate(attachment.createdAt)}
		</p>
	</div>
	<div class="flex shrink-0 items-center gap-2">
		<a
			href={attachmentHref(projectId, taskId, attachment.id, 'download')}
			class="rounded-full border border-hairline px-3 py-1 font-display text-xs text-chalk/60
				transition hover:border-chalk/40 hover:text-chalk"
		>
			Download
		</a>
		<button
			type="button"
			onclick={() => (isRemoveModalOpen = true)}
			aria-label={`Remove “${attachment.filename}”`}
			class="px-1 text-chalk/40 transition hover:text-signal"
		>
			✕
		</button>
	</div>
</li>

<DangerConfirmModal
	title="Remove attachment"
	description={`This permanently deletes “${attachment.filename}” from the task. This cannot be undone.`}
	action="?/deleteAttachment"
	fields={{ attachmentId: attachment.id }}
	submitLabel="Remove file"
	bind:isOpen={isRemoveModalOpen}
/>
