<script lang="ts">
	import type { DashboardTool } from './dashboardTools.svelte';

	let {
		tools,
		activeKey,
		badgeCounts = {},
		onSelect
	}: {
		tools: DashboardTool[];
		activeKey: string | null;
		badgeCounts?: Record<string, number>;
		onSelect: (key: string) => void;
	} = $props();
</script>

<nav
	aria-label="Tools"
	class="pointer-events-auto flex items-center gap-0.5 rounded-2xl border border-hairline
		bg-night/80 p-1 backdrop-blur-sm"
>
	{#each tools as tool (tool.key)}
		<button
			type="button"
			title={tool.label}
			aria-label={tool.label}
			aria-pressed={activeKey === tool.key}
			onclick={() => onSelect(tool.key)}
			class={[
				'relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 transition lg:px-3',
				activeKey === tool.key
					? 'bg-hairline/60 text-signal'
					: 'text-chalk/50 hover:bg-hairline/30 hover:text-chalk'
			]}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				{#each tool.iconPaths as pathData (pathData)}
					<path d={pathData} />
				{/each}
			</svg>
			<span class="hidden font-display text-xs lg:inline">{tool.label}</span>
			{#if (badgeCounts[tool.key] ?? 0) > 0}
				<span
					class="absolute -top-0.5 -right-0.5 rounded-full bg-signal px-1 font-display
						text-[9px] font-medium text-night"
				>
					{badgeCounts[tool.key]}
				</span>
			{/if}
		</button>
	{/each}
</nav>
