<script lang="ts">
	let { unreadCount }: { unreadCount: number } = $props();
</script>

<a
	href="/notifications"
	aria-label={`Notifications, ${unreadCount} unread`}
	class="relative font-display text-sm text-chalk/80 transition hover:text-chalk"
>
	🔔
	{#if unreadCount > 0}
		<span
			class="absolute -top-2 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full
				bg-signal px-1 font-display text-[10px] font-medium text-night"
		>
			{unreadCount}
		</span>
	{/if}
</a>
