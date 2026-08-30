<script lang="ts">
	import type { RailItem } from './railTypes';

	let {
		items,
		activeKey,
		badgeCounts = {},
		onSelect
	}: {
		items: RailItem[];
		activeKey: string | null;
		badgeCounts?: Record<string, number>;
		onSelect: (key: string) => void;
	} = $props();
</script>

<nav
	class="flex shrink-0 items-center justify-around border-t border-hairline bg-carriage/70
		py-1.5 lg:w-14 lg:flex-col lg:justify-start lg:gap-1.5 lg:border-t-0
		lg:border-r lg:py-3"
>
	{#each items as item (item.key)}
		<button
			type="button"
			title={item.label}
			aria-label={item.label}
			aria-pressed={activeKey === item.key}
			onclick={() => onSelect(item.key)}
			class={`relative rounded-xl p-2.5 transition ${
				activeKey === item.key
					? 'bg-hairline/60 text-signal'
					: 'text-chalk/50 hover:bg-hairline/30 hover:text-chalk'
			}`}
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				{#each item.iconPaths as pathData (pathData)}
					<path d={pathData} />
				{/each}
			</svg>
			{#if (badgeCounts[item.key] ?? 0) > 0}
				<span
					class="absolute -top-0.5 -right-0.5 rounded-full bg-signal px-1 font-display
						text-[9px] font-medium text-night"
				>
					{badgeCounts[item.key]}
				</span>
			{/if}
		</button>
	{/each}
</nav>
