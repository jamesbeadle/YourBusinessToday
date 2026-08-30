<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		isOpen = false,
		badgeCount = 0,
		children
	}: { title: string; isOpen?: boolean; badgeCount?: number; children: Snippet } = $props();
</script>

<details
	open={isOpen}
	class="group rounded-2xl border border-hairline bg-carriage/50 open:bg-carriage/70"
>
	<summary
		class="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 select-none"
	>
		<span class="flex items-center gap-2">
			<span class="font-display text-lg font-medium">{title}</span>
			{#if badgeCount > 0}
				<span
					class="rounded-full bg-signal px-2 py-0.5 font-display text-xs font-medium text-night"
				>
					{badgeCount}
				</span>
			{/if}
		</span>
		<span class="font-display text-sm text-chalk/40 transition group-open:rotate-180">▾</span>
	</summary>
	<div class="flex flex-col gap-4 border-t border-hairline px-5 py-4">
		{@render children()}
	</div>
</details>
