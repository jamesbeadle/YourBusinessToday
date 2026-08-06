<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { NotificationListItem } from '$lib/server/notifications/notificationListItem';

	let {
		notification,
		authorName
	}: { notification: NotificationListItem; authorName: string } = $props();

	const tracker = new FormTracker();

	const formattedDate = $derived(
		new Date(notification.createdAt).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		})
	);
</script>

<li class="flex items-start gap-4 px-5 py-4" class:opacity-60={notification.isRead}>
	{#if !notification.isRead}
		<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-go" aria-label="Unread"></span>
	{:else}
		<span class="mt-2 h-2 w-2 shrink-0"></span>
	{/if}
	<div class="min-w-0 flex-1">
		<p class="text-sm">
			<span class="font-display text-chalk/90">{authorName}</span>
			<span class="text-chalk/60"> commented on </span>
			<span class="font-display text-chalk/90">{notification.taskTitle}</span>
		</p>
		<p class="truncate text-sm text-chalk/60">{notification.commentBody}</p>
		<p class="text-xs text-chalk/40">{formattedDate}</p>
	</div>
	<form method="POST" action="?/openNotification" use:enhance={tracker.submit()}>
		<input type="hidden" name="notificationId" value={notification.id} />
		<input type="hidden" name="projectId" value={notification.projectId} />
		<input type="hidden" name="taskId" value={notification.taskId} />
		<SubmitButton
			isSaving={tracker.isSaving}
			savingLabel="Opening…"
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/70
				transition hover:border-go hover:text-go"
		>
			Open task
		</SubmitButton>
	</form>
</li>
