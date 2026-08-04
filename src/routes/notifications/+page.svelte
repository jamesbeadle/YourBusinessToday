<script lang="ts">
	import { enhance } from '$app/forms';
	import NotificationRow from '$lib/components/projects/NotificationRow.svelte';

	let { data } = $props();

	const hasUnread = $derived(data.notifications.some((notification) => !notification.isRead));

	function authorName(authorId: string): string {
		const author = data.staffMembers.find((staffMember) => staffMember.id === authorId);
		return author?.name ?? 'Former staff';
	}
</script>

<svelte:head>
	<title>Notifications — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
	<div class="flex items-baseline justify-between gap-4">
		<h1 class="font-display text-3xl font-medium">Notifications</h1>
		{#if hasUnread}
			<form method="POST" action="?/markAllRead" use:enhance>
				<button
					type="submit"
					class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs
						text-chalk/70 transition hover:border-go hover:text-go"
				>
					Mark all read
				</button>
			</form>
		{/if}
	</div>
	{#if data.notifications.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			Nothing yet — you'll be notified when someone comments on a task assigned to you.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.notifications as notification (notification.id)}
				<NotificationRow {notification} authorName={authorName(notification.commentAuthorId)} />
			{/each}
		</ul>
	{/if}
</div>
