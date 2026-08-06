<script lang="ts">
	let { unreadCount }: { unreadCount: number } = $props();
</script>

<a
	href="/notifications"
	aria-label={`Notifications, ${unreadCount} unread`}
	class="relative text-chalk/80 transition hover:text-chalk"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-5 w-5"
		aria-hidden="true"
	>
		<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
		<path d="M13.73 21a2 2 0 0 1-3.46 0" />
	</svg>
	{#if unreadCount > 0}
		<span
			class="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full
				bg-signal px-1 font-display text-[10px] font-medium text-night"
		>
			{unreadCount}
		</span>
	{/if}
</a>
